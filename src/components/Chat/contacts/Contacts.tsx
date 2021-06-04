import { ReactElement, useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  makeStyles,
  Typography,
  Fab,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AddContactDialog from "./AddContactDialog";
import { database } from "../../../firebase";
import Contact from "./Contact";

const useStyles = makeStyles({
  contactsBox: {
    direction: "rtl",
    height: "100%",
    overflow: "auto",
  },
  list: {
    direction: "ltr",
  },
  listItem: {
    direction: "ltr",
    borderTop: "1px solid black",
  },
  contactsHeader: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    margin: "10px",
  },
  addContactButton: {},
});

export type Contact = {
  key: string;
  name: string;
  members: string[];
  createdAt: Date;
};

export default function Contacts(): ReactElement {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);

  const handleToggle = () => {
    return setOpen(!open);
  };

  useEffect(() => {
    const contactRef = database.ref("contacts");
    contactRef.on("value", (snapshot) => {
      let fetchedContacts: Contact[] = [];
      snapshot.forEach((childSnapshot) => {
        // const
        fetchedContacts.push({
          key: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setContacts(fetchedContacts);
    });
  }, []);

  return (
    <Box className={classes.contactsBox}>
      <Box className={classes.contactsHeader}>
        <Typography variant="h3">Contacts</Typography>
        <Fab
          color="primary"
          className={classes.addContactButton}
          onClick={handleToggle}
        >
          <AddIcon />
        </Fab>
      </Box>
      <List className={classes.list}>
        {contacts.map((contact) => {
          return (
            <ListItem key={contact.key}>
              <Contact name={contact.name} members={contact.members} />
            </ListItem>
          );
        })}
      </List>
      <AddContactDialog open={open} handleToggle={handleToggle} />
    </Box>
  );
}
