import { ReactElement, useRef } from "react";
import Contacts from "./contacts/Contacts";
import ChatBody from "./chatBody/ChatBody";
import useFetchMessage from "../../hooks/useFetchMessage";
import useFetchContacts from "../../hooks/useFetchContacts";

export default function Chat(): ReactElement {
  const chatDivRef = useRef<HTMLDivElement>(null);

  const { contacts, contact, setContact, handleContactChangeOnMessage } =
    useFetchContacts();

  const { messages, loading, fetchOldMessages } = useFetchMessage({
    contact,
    chatDivRef,
    handleContactChangeOnMessage,
  });

  return (
    <div style={{ height: "100%" }}>
      <Contacts
        contacts={contacts}
        setContactHandler={setContact}
        chosenContact={contact}
      />
      {contact && (
        <ChatBody
          loading={loading}
          contactProp={contact}
          messages={messages}
          fetchOldMessages={fetchOldMessages}
          chatDivRef={chatDivRef}
        />
      )}
    </div>
  );
}
