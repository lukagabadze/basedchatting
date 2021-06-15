import { Socket } from "socket.io";

export type MessageType = {
  id: string;
  text: string;
  sender: string;
  contactId: string;
  createdAt: Date;
  members: string[] | undefined;
};

export const onNewMessage = (socket: Socket, message: MessageType) => {
  if (!message.members) return;

  const { members } = message;

  delete message.members;
  members.forEach((member) => {
    socket.emit(member, message);
  });
};
