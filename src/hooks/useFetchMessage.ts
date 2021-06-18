import { useState, useEffect } from "react";
import { MessageType } from "../components/Chat/chatBody/Message";
import { MessagesType } from "../components/Chat/Chat";
import { ContactType } from "../components/Chat/contacts/Contacts";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { database } from "../firebase";

export default function useFetchMessage(contact: ContactType | null) {
  const [messages, setMessages] = useState<MessagesType>({});
  const [loading, setLoading] = useState<boolean>(false);

  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    if (!user) return;
    if (!socket) return;

    socket.on(user.uid, (message: MessageType) => {
      const { contactId } = message;

      if (!message.contactId) return;
      if (!messages[contactId]) return;

      if (!messages[contactId].includes(message)) {
        setMessages({
          ...messages,
          [contactId]: [...messages[contactId], message],
        });
      }
    });

    return () => {
      socket.off(user.uid);
    };
  }, [socket, user, messages]);

  useEffect(() => {
    async function fetchMessages() {
      if (!user) return;
      if (!contact) return;
      if (contact.id in messages) return;

      setLoading(true);

      const firestoreMessagesRef = database.collection("messages");
      const snapshot = await firestoreMessagesRef
        .where("contactId", "==", contact.id)
        .orderBy("createdAt", "desc")
        .limit(25)
        .get();

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

      const reversedMessages = messagesList.reverse();

      setLoading(false);
      setMessages({ ...messages, [contact.id]: reversedMessages });
    }

    fetchMessages();
  }, [messages, user, contact]);

  return { messages, loading };
}
