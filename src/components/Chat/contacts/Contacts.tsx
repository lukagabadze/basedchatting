import { ReactElement, useEffect, useState } from "react";
import {
  Box,
  List,
  makeStyles,
  Typography,
  Fab,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
} from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
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
  contactsHeader: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    margin: theme.spacing(1),
    marginBottom: 0,
  },
  addContactButton: {},
  toolbar: theme.mixins.toolbar,
}));

interface Props {
  contacts: ContactType[];
  chosenContact: ContactType | null;
  setContactHandler: (contact: ContactType) => void;
  drawerOpen: boolean;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
}

export default function Contacts({
  contacts,
  chosenContact,
  setContactHandler,
  drawerOpen,
  handleDrawerClose,
  handleDrawerOpen,
}: Props): ReactElement {
  const [dialogOpen, setDialogOpen] = useState(false);

  const classes = useStyles();
  const { fetchAndMapUsers } = useUsersMap();

  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));

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
    <SwipeableDrawer
      className={classes.contactsDrawer}
      variant={md ? "permanent" : "temporary"}
      open={drawerOpen}
      onClose={handleDrawerClose}
      onOpen={handleDrawerOpen}
      anchor="left"
      PaperProps={{ style: md ? { width: contactsWidth } : { width: "100vw" } }}
    >
      {md && <div className={classes.toolbar} />}
      <Box className={classes.contactsHeader}>
        <Typography variant="h4" style={{ fontWeight: "bold" }}>
          Contacts
        </Typography>
        <Fab
          color="secondary"
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
    </SwipeableDrawer>
  );
}
