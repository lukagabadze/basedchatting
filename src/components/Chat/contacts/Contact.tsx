import React, { ReactElement } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
  Avatar,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import { ContactType } from "../../../hooks/useFetchContacts";
import { useAvatar } from "../../../contexts/AvatarContext";
import { useAuth } from "../../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
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
}));

interface Props {
  contact: ContactType;
  chosenContact: ContactType | null;
  setContactHandler: (contact: ContactType) => void;
}

export default function Contact({
  contact,
  chosenContact,
  setContactHandler,
}: Props): ReactElement {
  const classes = useStyles();
  const { userAvatarMap } = useAvatar();
  const { user } = useAuth();

  return (
    <ListItem
      key={contact.id}
      button
      dense
      disableGutters
      divider
      onClick={() => setContactHandler(contact)}
      selected={Boolean(chosenContact && chosenContact.id === contact.id)}
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
}
