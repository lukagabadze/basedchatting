import { createServer } from "http";
import { Server, Socket } from "socket.io";

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

  socket.on("new-message", (message: MessageType) => {
    if (!message.members) return;

    const { members } = message;

    delete message.members;
    members.forEach((member) => {
      io.emit(member, message);
    });
  });
});

httpServer.listen(4000);
