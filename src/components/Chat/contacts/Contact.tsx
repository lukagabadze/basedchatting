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
  const { name, members } = contactProp;

  useEffect(() => {
    const fetchMemberNames = () => {
      let memberNames: string[] = [];
      members.forEach(async (uid, ind) => {
        const snapshot = await database.ref(`users/${uid}`).once("value");
        const { displayName } = snapshot.val();
        memberNames.push(displayName);

        if (ind === members.length - 1) {
          setContact({ ...contact, name: memberNames.join(", ") });
        }
      });
    };

    if (!name) return fetchMemberNames();

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
