import { ReactElement, useState } from "react";
import Contacts, { ContactType } from "./contacts/Contacts";
import ChatBody from "./chatBody/ChatBody";
import { Grid } from "@material-ui/core";

interface Props {}

export default function Chat({}: Props): ReactElement {
  const [contact, setContact] = useState<ContactType | null>(null);

  const setContactHandler = (contact: ContactType) => {
    setContact(contact);
  };

  return (
    <Grid
      container
      style={{
        height: "100%",
      }}
    >
      <Grid
        item
        xs={3}
        style={{
          height: "100%",
        }}
      >
        <Contacts setContactHandler={setContactHandler} />
      </Grid>
      <Grid item xs={9}>
        <ChatBody contactProp={contact} />
      </Grid>
    </Grid>
  );
}
