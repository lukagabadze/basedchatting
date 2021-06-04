import { ReactElement, useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  makeStyles,
  Typography,
  Fab,
  Button,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AddContactDialog from "./AddContactDialog";
import { database } from "../../../firebase";
import Contact from "./Contact";

interface Props {
  setContactHandler: (contact: ContactType) => void;
}

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

export type ContactType = {
  key: string;
  name: string;
  members: string[];
  createdAt: Date;
};

export default function Contacts({ setContactHandler }: Props): ReactElement {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactType[]>([]);

  const handleToggle = () => {
    return setOpen(!open);
  };

  useEffect(() => {
    const contactRef = database.ref("contacts");
    contactRef.on("value", (snapshot) => {
      let fetchedContacts: ContactType[] = [];
      snapshot.forEach((childSnapshot) => {
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
            <ListItem key={contact.key} dense disableGutters divider>
              <Contact
                contactProp={contact}
                setContactHandler={setContactHandler}
              />
            </ListItem>
          );
        })}
      </List>
      <AddContactDialog open={open} handleToggle={handleToggle} />
    </Box>
  );
}
