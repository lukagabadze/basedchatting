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
  Avatar,
} from "@material-ui/core";
import GroupAddIcon from "@material-ui/icons/GroupAdd";
import AddContactDialog from "./AddContactDialog";
import { useAuth } from "../../../contexts/AuthContext";
import { useAvatar } from "../../../contexts/AvatarContext";
import { AvatarGroup } from "@material-ui/lab";
import { ContactType } from "../../../hooks/useFetchContacts";

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
  listItemText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  userAvatars: {
    backgroundColor: "gray",
    width: theme.spacing(6),
    height: theme.spacing(6),
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

  const { user } = useAuth();
  const classes = useStyles();
  const { userAvatarMap, fetchAndMapUsers } = useAvatar();

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
        {contacts.map((contact) => {
          return (
            <ListItem
              key={contact.id}
              button
              dense
              disableGutters
              divider
              onClick={() => setContactHandler(contact)}
              selected={Boolean(
                chosenContact && chosenContact.id === contact.id
              )}
            >
              <ListItemIcon>
                <AvatarGroup
                  max={3}
                  spacing="small"
                  classes={{ avatar: classes.userAvatars }}
                >
                  {contact.members.map((member) => {
                    if (member === user?.uid) return null;

                    return <Avatar key={member} src={userAvatarMap[member]} />;
                  })}
                </AvatarGroup>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Typography
                    variant="body2"
                    style={{ fontWeight: 600 }}
                    className={classes.listItemText}
                  >
                    {contact.name}
                  </Typography>
                }
                secondary={
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    className={classes.listItemText}
                  >
                    Gabo: last message sample text...
                  </Typography>
                }
              />
            </ListItem>
          );
        })}
      </List>
      <AddContactDialog open={dialogOpen} handleToggle={handleToggle} />
    </Drawer>
  );
}
