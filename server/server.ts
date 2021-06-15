import { createServer } from "http";
import { Server, Socket } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {});

import { MessageType, onNewMessage } from "./sockets/chatSockets";
io.on("connection", (socket: Socket) => {
  console.log("new user connected");

  socket.on("new-message", (message: MessageType) => {
    onNewMessage(socket, message);
  });
});

httpServer.listen(4000);
