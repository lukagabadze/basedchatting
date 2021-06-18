import { ReactElement, useState, useCallback } from "react";
import Contacts, { ContactType } from "./contacts/Contacts";
import ChatBody from "./chatBody/ChatBody";
import { MessageType } from "./chatBody/Message";
import useFetchMessage from "../../hooks/useFetchMessage";

export type MessagesType = {
  [key: string]: MessageType[];
};

export default function Chat(): ReactElement {
  const [contact, setContact] = useState<ContactType | null>(null);
  const { messages, loading, fetchOldMessages } = useFetchMessage(contact);

  const setContactHandler = useCallback((newContact: ContactType) => {
    setContact(newContact);
  }, []);

  return (
    <div style={{ height: "100%" }}>
      <Contacts chosenContact={contact} setContactHandler={setContactHandler} />
      {contact && (
        <ChatBody
          loading={loading}
          contactProp={contact}
          messages={messages}
          fetchOldMessages={fetchOldMessages}
        />
      )}
    </div>
  );
}
