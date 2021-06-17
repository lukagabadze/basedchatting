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

io.on("connection", (socket: Socket) => {
  console.log("new user connected");

  socket.on("new-message", async (message: MessageType) => {
    if (!message.members) return;

    const { members } = message;
    delete message.members;

    const messagesRef = database.collection("messages");
    const newMessage = await messagesRef.add(message);

    message.id = newMessage.id;
    members.forEach(async (member) => {
      io.emit(member, message);
    });
  });
});

httpServer.listen(4000);
