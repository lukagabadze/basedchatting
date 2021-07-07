import { useState, useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { database } from "../firebase";
import { ContactType } from "./useFetchContacts";

export type MessageType = {
  id: string;
  text?: string;
  imageUrl?: string;
  sender: string;
  contactId: string;
  createdAt: Date;
};

export type MessagesType = {
  [key: string]: MessageType[];
};

interface Props {
  contact: ContactType | null;
  firstMessage: HTMLDivElement | null;
  handleContactChangeOnMessage: (contactId: string) => void;
}

export default function useFetchMessage({
  contact,
  firstMessage,
  handleContactChangeOnMessage,
}: Props) {
  const [messages, setMessages] = useState<MessagesType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const messageScrollRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    async function fetchMessages() {
      if (!user) return;
      if (!contact) return;
      if (contact.id in messages) return;

      setLoading(true);

      const messagesRef = database.collection("messages");
      const snapshot = await messagesRef
        .where("contactId", "==", contact.id)
        .orderBy("createdAt", "desc")
        .limit(25)
        .get();

      let messagesList: MessageType[] = [];
      snapshot.forEach((doc) => {
        const { text, imageUrl, sender, contactId, createdAt } = doc.data();
        messagesList.push({
          id: doc.id,
          text,
          imageUrl,
          sender,
          contactId,
          createdAt,
        });
      });

      setLoading(false);
      setMessages({ ...messages, [contact.id]: messagesList });
    }

    fetchMessages();
  }, [messages, user, contact]);

  useEffect(() => {
    if (!user) return;
    if (!socket) return;

    socket.on(`new-message-${user.uid}`, (message: MessageType) => {
      const { contactId } = message;

      if (
        contactId in messages &&
        messages[contactId].filter((oldMessage) => oldMessage.id === message.id)
          .length
      )
        return;

      const messagesTmp = { ...messages };

      if (contactId in messages) {
        messagesTmp[contactId] = [message, ...messagesTmp[contactId]];
      } else {
        messagesTmp[contactId] = [message];
      }

      setMessages(messagesTmp);

      // move the contact to the top
      handleContactChangeOnMessage(contactId);

      // Scroll the user to the bottom
      if (firstMessage) {
        firstMessage.scrollIntoView();
      }
    });

    return () => {
      socket.off(`new-message-${user.uid}`);
    };
  }, [socket, user, messages, firstMessage, handleContactChangeOnMessage]);

  async function fetchOldMessages(
    lastMessage: MessageType,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ) {
    const { contactId } = lastMessage;

    setLoading(true);

    const messagesRef = database.collection("messages");
    const snapshot = await messagesRef
      .where("contactId", "==", contactId)
      .orderBy("createdAt", "desc")
      .startAfter(lastMessage.createdAt)
      .limit(20)
      .get();

    setLoading(false);

    let messagesList: MessageType[] = [];
    snapshot.forEach((doc) => {
      const { text, sender, contactId, createdAt } = doc.data();
      messagesList.push({
        id: doc.id,
        text,
        sender,
        contactId,
        createdAt,
      });
    });

    if (!messagesList.length) return;

    setMessages({
      ...messages,
      [contactId]: [...messages[contactId], ...messagesList],
    });
  }

  return { messages, loading, messageScrollRef, fetchOldMessages };
}
