import { ReactElement, useState, useEffect } from "react";
import Contacts, { ContactType } from "./contacts/Contacts";
import ChatBody from "./chatBody/ChatBody";
import { MessageType } from "./chatBody/Message";
import { database } from "../../firebase";
import { useAvatar } from "../../contexts/AvatarContext";

export type MessagesType = {
  [key: string]: MessageType[];
};

export default function Chat(): ReactElement {
  const [contact, setContact] = useState<ContactType | null>(null);
  const [messages, setMessages] = useState<MessagesType>({});
  const [loading, setLoading] = useState(false);
  useAvatar(contact?.members);

  const setContactHandler = (newContact: ContactType) => {
    setContact(newContact);
  };

  useEffect(() => {
    async function fetchMessages() {
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
      setMessages({ ...messages, [contact.id]: messagesList.reverse() });
    }

    fetchMessages();
  }, [contact]);

  console.log(messages);

  return (
    <div style={{ height: "100%" }}>
      <Contacts chosenContact={contact} setContactHandler={setContactHandler} />
      {contact && (
        <ChatBody loading={loading} contactProp={contact} messages={messages} />
      )}
    </div>
  );
}
