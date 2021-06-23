import { ReactElement, useEffect, useState } from "react";
import {
  Box,
  List,
  makeStyles,
  Typography,
  Fab,
  Drawer,
} from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import RecentActorsIcon from "@material-ui/icons/RecentActors";
import AddContactDialog from "./AddContactDialog";
import { ContactType } from "../../../hooks/useFetchContacts";
import Contact from "./Contact";
import { useUsersMap } from "../../../contexts/UsersMapContext";

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

interface Props {
  contacts: ContactType[];
  chosenContact: ContactType | null;
  setContactHandler: (contact: ContactType) => void;
}

export default function Contacts({
  contacts,
  chosenContact,
  setContactHandler,
}: Props): ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);

  const classes = useStyles();
  const { fetchAndMapUsers } = useUsersMap();

  const handleToggle = () => {
    return setDialogOpen(!dialogOpen);
  };

  useEffect(() => {
    const contactsTmp = [...contacts];
    let allMembers: string[] = [];
    contactsTmp.map((contact) => {
      return (allMembers = [...allMembers, ...contact.members]);
    });
    allMembers = allMembers.filter(
      (member, ind) => allMembers.indexOf(member) === ind
    );

    fetchAndMapUsers(allMembers);
  }, [contacts, fetchAndMapUsers]);

  return (
    <Drawer
      className={classes.contactsDrawer}
      variant="persistent"
      anchor="left"
      open={true}
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
        {contacts.map((contact) => (
          <Contact
            key={contact.id}
            contact={contact}
            chosenContact={chosenContact}
            setContactHandler={setContactHandler}
          />
        ))}
      </List>
      <AddContactDialog open={dialogOpen} handleToggle={handleToggle} />
    </Drawer>
  );
}
