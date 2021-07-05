import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { database } from "./firebase";

const httpServer = createServer();
const io = new Server(httpServer, {});

export type MessageType = {
  id: string;
  text?: string;
  imageUrl?: string;
  sender: string;
  contactId: string;
  createdAt: Date;
  members: string[] | undefined;
};

export type ContactType = {
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
  seenBy: string[];
};

io.on("connection", (socket: Socket) => {
  console.log("new user connected");

  // Recieve, save and send back the message
  socket.on("new-message", async (message: MessageType) => {
    if (!message.members) return;

    // fetch senders name
    const snapshot = await database.doc(`users/${message.sender}`).get();
    const user = snapshot.data();
    if (!user) return;

    const { members } = message;
    delete message.members;

    const messagesRef = database.collection("messages");
    const newMessage = await messagesRef.add(message);

    // update contact with the latest message date
    await database.doc(`contacts/${message.contactId}`).update({
      lastMessageDate: message.createdAt,
      lastMessage: {
        sender: user.displayName,
        text: message.text ? message.text : "Sent an image",
      },
      seenBy: [message.sender],
    });

    message.id = newMessage.id;
    members.forEach(async (member) => {
      io.emit(`new-message-${member}`, message);
    });
  });

  // Recieve, save and send back the contact
  socket.on("new-contact", async (contact: ContactType) => {
    if (!contact.members) return;

    const contactsRef = database.collection("contacts");
    const newContact = await contactsRef.add(contact);

    contact.id = newContact.id;
    contact.members.forEach((member) => {
      io.emit(`new-contact-${member}`, contact);
    });
  });

  // Recieve, save and send back contact updates
  socket.on("contact-update", async ({ contactId, contactName, members }) => {
    if (!contactId) return;
    if (!contactName && !members) return;

    const contactRef = database.doc(`contacts/${contactId}`);
    const snapshot = await contactRef.get();
    const contact = snapshot.data() as ContactType;
    if (!contact) return;

    contact.seenBy = [];
    if (contactName) contact.name = contactName;
    if (members) contact.members = members;

    await contactRef.update(contact);

    contact.id = contactId;
    contact.members.forEach((member) => {
      io.emit(`contact-update-${member}`, contact);
    });
  });

  socket.on("emoji-update", (emoji) => {
    socket.broadcast.emit("emoji-update", emoji);
  });

  interface isTypingFn {
    contactId: string;
    userUid: string;
    isTyping: boolean;
  }

  socket.on("is-typing", ({ contactId, userUid, isTyping }: isTypingFn) => {
    socket.broadcast.emit(`is-typing-${contactId}`, { userUid, isTyping });
  });
});

const PORT = process.env.NODE_ENV === "production" ? process.env.PORT : 4000;

httpServer.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
