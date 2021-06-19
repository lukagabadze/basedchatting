import { RefObject, useState, useEffect, useRef } from "react";
import { MessageType } from "../components/Chat/chatBody/Message";
import { MessagesType } from "../components/Chat/Chat";
import { ContactType } from "../components/Chat/contacts/Contacts";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { database } from "../firebase";

interface Props {
  contact: ContactType | null;
  chatDivRef: RefObject<HTMLDivElement>;
}

export default function useFetchMessage({ contact, chatDivRef }: Props) {
  const [messages, setMessages] = useState<MessagesType>({});
  const [loading, setLoading] = useState<boolean>(false);
  const messageScrollRef = useRef<HTMLDivElement | null>(null);

  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    if (!user) return;
    if (!socket) return;

    socket.on(user.uid, (message: MessageType) => {
      const { contactId } = message;

      if (!messages[contactId]) return;
      if (messages[contactId].includes(message)) return;

      setMessages({
        ...messages,
        [contactId]: [message, ...messages[contactId]],
      });

      // Scroll the user to the bottom
      if (chatDivRef.current) {
        chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
      }
    });

    return () => {
      socket.off(user.uid);
    };
  }, [socket, user, messages, chatDivRef]);

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
        const { text, sender, contactId, createdAt } = doc.data();
        messagesList.push({
          id: doc.id,
          text,
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

  async function fetchOldMessages(lastMessage: MessageType) {
    const { contactId } = lastMessage;

    const messagesRef = database.collection("messages");
    const snapshot = await messagesRef
      .where("contactId", "==", contactId)
      .orderBy("createdAt", "desc")
      .startAfter(lastMessage.createdAt)
      .limit(20)
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

    if (!messagesList.length) return;

    setMessages({
      ...messages,
      [contactId]: [...messages[contactId], ...messagesList],
    });
  }

  return { messages, loading, messageScrollRef, fetchOldMessages };
}
