import { ReactElement, useState } from "react";
import Contacts, { ContactType } from "./contacts/Contacts";
import ChatBody from "./chatBody/ChatBody";

interface Props {}

export default function Chat({}: Props): ReactElement {
  const [contact, setContact] = useState<ContactType | null>(null);

  const setContactHandler = (newContact: ContactType) => {
    setContact(newContact);
  };

  return (
    <div style={{ height: "100%" }}>
      <Contacts chosenContact={contact} setContactHandler={setContactHandler} />
      {contact && <ChatBody contactProp={contact} />}
    </div>
  );
}
