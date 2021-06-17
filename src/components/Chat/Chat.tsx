import { ReactElement, useState, useEffect, useCallback } from "react";
import Contacts, { ContactType } from "./contacts/Contacts";
import ChatBody from "./chatBody/ChatBody";
import { MessageType } from "./chatBody/Message";
import { database } from "../../firebase";
import { useSocket } from "../../contexts/SocketContext";
import { useAuth } from "../../contexts/AuthContext";

export type MessagesType = {
  [key: string]: MessageType[];
};

export default function Chat(): ReactElement {
  const [contact, setContact] = useState<ContactType | null>(null);
  const [messages, setMessages] = useState<MessagesType>({});
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const socket = useSocket();

  const setContactHandler = useCallback((newContact: ContactType) => {
    setContact(newContact);
  }, []);

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
        .limit(5)
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
      setMessages({ ...messages, [contact.id]: messagesList.reverse() });
    }

    fetchMessages();
  }, [messages, user, contact]);

  return (
    <div style={{ height: "100%" }}>
      <Contacts chosenContact={contact} setContactHandler={setContactHandler} />
      {contact && (
        <ChatBody loading={loading} contactProp={contact} messages={messages} />
      )}
    </div>
  );
}
