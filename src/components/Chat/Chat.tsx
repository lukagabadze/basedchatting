import { ReactElement, useCallback, useRef } from "react";
import Contacts from "./contacts/Contacts";
import ChatBody from "./chatBody/ChatBody";
import useFetchMessage from "../../hooks/useFetchMessage";
import useFetchContacts, { ContactType } from "../../hooks/useFetchContacts";
import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../firebase";

export default function Chat(): ReactElement {
  const chatDivRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();

  const {
    contacts,
    contact,
    setContact,
    setContacts,
    handleContactChangeOnMessage,
  } = useFetchContacts();

  const { messages, loading, fetchOldMessages } = useFetchMessage({
    contact,
    chatDivRef,
    handleContactChangeOnMessage,
  });

  const setContactHandler = useCallback(
    (contact: ContactType) => {
      if (!contact) return;
      setContact(contact);

      if (!user) return;
      if (contact.seenBy.includes(user.uid)) return;

      const contactRef = database.doc(`contacts/${contact.id}`);

      const newSeenBy = [...contact.seenBy, user.uid];

      contactRef.update({
        seenBy: newSeenBy,
      });

      const newContacts = contacts.map((singleContact) => {
        if (singleContact.id === contact.id) {
          return {
            ...singleContact,
            seenBy: newSeenBy,
          };
        }
        return singleContact;
      });

      setContacts(newContacts);
    },
    [user, contacts, setContact, setContacts]
  );

  return (
    <div style={{ height: "100%" }}>
      <Contacts
        contacts={contacts}
        setContactHandler={setContactHandler}
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
