import { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { Typography } from "@material-ui/core";

export type Contact = {
  uid: string;
  email: string;
};

export default function Contacts(): ReactElement {
  const [contacts, setContacts] = useState<Array<Contact>>([]);

  useEffect(() => {
    axios.get("http://localhost:4000/user/all").then((res) => {
      const users = res.data;
      setContacts(users);
    });
  }, []);

  console.log(contacts);

  return (
    <div style={{ backgroundColor: "green", height: "100vh" }}>
      {contacts.map((contact) => {
        return (
          <Typography key={contact.uid} style={{ backgroundColor: "purple" }}>
            {contact.email}
          </Typography>
        );
      })}
    </div>
  );
}
