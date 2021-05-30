import { ReactElement, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
  Fab,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AddContactDialog from "./AddContactDialog";

export type Contact = {
  uid: string;
  email: string;
};

const useStyles = makeStyles({
  list: {
    direction: "rtl",
    height: "100%",
    overflow: "auto",
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

export default function Contacts(): ReactElement {
  const classes = useStyles();
  const [contacts, setContacts] = useState<Array<Contact>>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:4000/user/all").then((res) => {
      const users = res.data;
      setContacts(users);
    });
  }, []);

  const handleToggle = () => {
    return setOpen(!open);
  };

  return (
    <>
      <List className={classes.list}>
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
        {contacts.map((contact) => {
          return (
            <ListItem className={classes.listItem}>
              <ListItemText key={contact.uid}>{contact.email}</ListItemText>
            </ListItem>
          );
        })}
      </List>
      <AddContactDialog open={open} handleToggle={handleToggle} />
    </>
  );
}
