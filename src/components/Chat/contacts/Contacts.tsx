import { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import { List, ListItem, ListItemText, makeStyles } from "@material-ui/core";

export type Contact = {
  uid: string;
  email: string;
};

const useStyles = makeStyles({
  list: {
    backgroundColor: "black",
    color: "white",
    height: "100%",
    overflow: "auto",
  },
});

export default function Contacts(): ReactElement {
  const classes = useStyles();
  const [contacts, setContacts] = useState<Array<Contact>>([]);

  useEffect(() => {
    axios.get("http://localhost:4000/user/all").then((res) => {
      const users = res.data;
      setContacts(users);
    });
  }, []);

  console.log(contacts);

  return (
    <List className={classes.list}>
      {contacts.map((contact) => {
        return (
          <ListItem>
            <ListItemText
              key={contact.uid}
              style={{ backgroundColor: "purple" }}
            >
              {contact.email}
            </ListItemText>
          </ListItem>
        );
      })}
    </List>
  );
}