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
import { useAuth } from "../../../contexts/AuthContext";

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
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
};

export default function Contacts({ setContactHandler }: Props): ReactElement {
  const { user } = useAuth();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactType[]>([]);

  const handleToggle = () => {
    return setOpen(!open);
  };

  useEffect(() => {
    async function fetchContacts() {
      if (!user) return;
      const contactsRef = database.collection("contacts");
      contactsRef
        .where("members", "array-contains", user.uid)
        .onSnapshot((docSnap) => {
          let contactsList: ContactType[] = [];
          docSnap.forEach((doc) => {
            const { name, members, createdAt } = doc.data();
            contactsList.push({
              id: doc.id,
              name,
              members,
              createdAt,
            });
          });

          setContacts(contactsList);
        });
    }

    fetchContacts();
  }, [user]);

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
            <ListItem key={contact.id} dense disableGutters divider>
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
