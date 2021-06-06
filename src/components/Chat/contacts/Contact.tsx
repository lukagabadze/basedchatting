import { ReactElement, useEffect, useState } from "react";
import { Typography, Button } from "@material-ui/core";
import { database } from "../../../firebase";
import { ContactType } from "./Contacts";

interface Props {
  contactProp: ContactType;
  setContactHandler: (contact: ContactType) => void;
}

export default function Contact({
  contactProp,
  setContactHandler,
}: Props): ReactElement {
  const [contact, setContact] = useState<ContactType>(contactProp);

  useEffect(() => {
    setContact(contactProp);
  }, [contactProp]);

  return (
    <Button
      fullWidth
      style={{ textTransform: "none" }}
      onClick={() => {
        setContactHandler(contact);
      }}
    >
      <Typography noWrap>{contact.name}</Typography>
    </Button>
  );
}
