import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { database } from "./firebase";

const httpServer = createServer();
const io = new Server(httpServer, {});

export type MessageType = {
  id: string;
  text: string;
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
};

io.on("connection", (socket: Socket) => {
  console.log("new user connected");

  // Recieve, save and send back the message
  socket.on("new-message", async (message: MessageType) => {
    if (!message.members) return;

    const { members } = message;
    delete message.members;

    const messagesRef = database.collection("messages");
    const newMessage = await messagesRef.add(message);

    // update contact with the latest message date
    await database.doc(`contacts/${message.contactId}`).update({
      lastMessageDate: message.createdAt,
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
});

httpServer.listen(4000);
