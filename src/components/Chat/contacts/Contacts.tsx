import { ReactElement, useEffect, useState } from "react";
import {
  Box,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Typography,
  Fab,
  ListItemIcon,
  Drawer,
} from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AddContactDialog from "./AddContactDialog";
import { database } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";

interface Props {
  setContactHandler: (contact: ContactType) => void;
}

export const contactsWidth = 300;

const useStyles = makeStyles((theme) => ({
  contactsDrawer: {
    direction: "rtl",
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
    alignItems: "center",
    margin: "10px",
  },
  addContactButton: {},
  toolbar: theme.mixins.toolbar,
}));

export type ContactType = {
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
};

export default function Contacts({ setContactHandler }: Props): ReactElement {
  const { user } = useAuth();
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [contacts, setContacts] = useState<ContactType[]>([]);

  const handleToggle = () => {
    return setDialogOpen(!dialogOpen);
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
    <Drawer
      className={classes.contactsDrawer}
      variant="persistent"
      anchor="left"
      open={drawerOpen}
      PaperProps={{ style: { width: contactsWidth } }}
    >
      <div className={classes.toolbar} />
      <Box className={classes.contactsHeader}>
        <Typography align="center" variant="h5">
          Contacts
        </Typography>
        <Fab
          color="primary"
          size="small"
          className={classes.addContactButton}
          onClick={handleToggle}
        >
          <GroupAddIcon />
        </Fab>
      </Box>
      <List className={classes.list}>
        {contacts.map((contact) => {
          return (
            <ListItem
              key={contact.id}
              button
              dense
              disableGutters
              divider
              onClick={() => setContactHandler(contact)}
            >
              <ListItemIcon>
                <AccountCircleIcon
                  fontSize="large"
                  style={{ margin: "auto" }}
                />
              </ListItemIcon>
              <ListItemText primary={contact.name} />
            </ListItem>
          );
        })}
      </List>
      <AddContactDialog open={dialogOpen} handleToggle={handleToggle} />
    </Drawer>
  );
}
