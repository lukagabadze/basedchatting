import { ReactElement, useEffect, useState } from "react";
import {
  Drawer,
  Typography,
  makeStyles,
  Divider,
  TextField,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Button,
  CircularProgress,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import CloseIcon from "@material-ui/icons/Close";
import { ContactType } from "../../../hooks/useFetchContacts";
import { useUsersMap } from "../../../contexts/UsersMapContext";
import { useSocket } from "../../../contexts/SocketContext";
import AddMemberDialog from "./AddMemberDialog";

const useStyles = makeStyles((theme) => ({
  drawerHeader: {
    margin: theme.spacing(1),
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  contactNameField: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: "300px",
  },
  membersHeader: {
    marginLeft: theme.spacing(1),
  },
  submitButton: {
    margin: theme.spacing(2),
    marginTop: 0,
  },
  inputDiv: {
    display: "flex",
    flexDirection: "column",
  },
}));

interface Props {
  open: boolean;
  handleClose: () => void;
  contact: ContactType;
}

export default function ContactSettingsDrawer({
  open,
  handleClose,
  contact,
}: Props): ReactElement {
  const [input, setInput] = useState<string>(contact.name);
  const [loading, setLoading] = useState<boolean>(false);
  const [memberAddOpen, setMemberAddOpen] = useState<boolean>(false);

  const { usersMap } = useUsersMap();
  const classes = useStyles();
  const socket = useSocket();

  useEffect(() => {
    setInput(contact.name);
    setLoading(false);
  }, [contact]);

  function inputChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setInput(e.target.value);
  }

  function submitButtonClickHandler() {
    if (!socket) return;
    if (input === contact.name) return;

    setLoading(true);
    socket.emit("contact-update", {
      contactId: contact.id,
      contactName: input,
    });
  }

  function handleMemberAddOpen() {
    setMemberAddOpen(true);
  }
  function handleMemberAddClose() {
    setMemberAddOpen(false);
  }

  return (
    <Drawer open={open} onClose={handleClose} anchor="right">
      <div style={{ maxWidth: "100vw" }}>
        {/* The header */}
        <div className={classes.drawerHeader}>
          <Typography variant="h5">Contact settings</Typography>
          <IconButton onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
        <Divider />

        {/* Contact name */}
        <div className={classes.inputDiv}>
          <TextField
            className={classes.contactNameField}
            value={input}
            onChange={inputChangeHandler}
            label="Contact name"
            variant="outlined"
          />
          {/* Submit button */}
          <Button
            className={classes.submitButton}
            onClick={submitButtonClickHandler}
            variant="contained"
            color="primary"
            disabled={input === contact.name}
          >
            {loading ? (
              <CircularProgress color="inherit" size={20} />
            ) : (
              "Submit"
            )}
          </Button>
        </div>

        {/* Contact members */}
        <Typography className={classes.membersHeader} variant="h5">
          Members
        </Typography>
        <List>
          {contact.members.map((member) => {
            if (!usersMap[member]) return;

            return (
              <ListItem key={member} divider>
                <ListItemAvatar>
                  <Avatar src={usersMap[member].imageUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography noWrap>
                      {usersMap[member].senderName}
                    </Typography>
                  }
                />
                <Divider />
              </ListItem>
            );
          })}

          <ListItem button onClick={handleMemberAddOpen}>
            <ListItemAvatar>
              <Avatar>
                <AddIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText>Add member</ListItemText>
          </ListItem>
        </List>

        <AddMemberDialog
          open={memberAddOpen}
          handleClose={handleMemberAddClose}
          contactId={contact.id}
          members={contact.members}
        />
      </div>
    </Drawer>
  );
}
