import { ReactElement } from "react";
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  makeStyles,
  Avatar,
} from "@material-ui/core";
import { AvatarGroup } from "@material-ui/lab";
import RadioButtonCheckedIcon from "@material-ui/icons/RadioButtonChecked";
import clsx from "clsx";
import { ContactType } from "../../../hooks/useFetchContacts";
import { useAuth } from "../../../contexts/AuthContext";
import { useUsersMap } from "../../../contexts/UsersMapContext";

const useStyles = makeStyles((theme) => ({
  contactTitle: {
    fontWeight: 500,
  },
  listItemText: {
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  contactNewMessage: {
    fontWeight: "bold",
    color: "black",
  },
  newMessageIcon: {
    paddingRight: theme.spacing(1),
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
  const { usersMap } = useUsersMap();
  const { user } = useAuth();

  const messageSeen =
    (user && contact && contact.seenBy.includes(user.uid)) ||
    (chosenContact && contact.id === chosenContact.id)
      ? true
      : false;

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

            return <Avatar key={member} src={usersMap[member]?.imageUrl} />;
          })}
        </AvatarGroup>
      </ListItemIcon>
      <ListItemText
        primary={
          <Typography
            variant="body2"
            className={clsx(
              classes.listItemText,
              classes.contactTitle,
              !messageSeen && classes.contactNewMessage
            )}
          >
            {contact.name}
          </Typography>
        }
        secondary={
          <Typography
            variant="body2"
            color="textSecondary"
            className={clsx(
              classes.listItemText,

              !messageSeen && classes.contactNewMessage
            )}
          >
            {`${contact.lastMessage?.sender}: ${contact.lastMessage?.text}`}
          </Typography>
        }
      />
      {!messageSeen && (
        <div className={classes.newMessageIcon}>
          <RadioButtonCheckedIcon color="secondary" />
        </div>
      )}
    </ListItem>
  );
}
