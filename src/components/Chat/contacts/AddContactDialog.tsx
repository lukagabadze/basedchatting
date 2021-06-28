import React, { ReactElement, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { database } from "../../../firebase";
import { useAuth, UserType } from "../../../contexts/AuthContext";
import { useSocket } from "../../../contexts/SocketContext";
import { useUsersMap } from "../../../contexts/UsersMapContext";

interface Props {
  open: boolean;
  handleToggle: () => void;
}

const useStyles = makeStyles((theme) => ({
  dialogHeader: {
    margin: "auto",
  },
  usersList: {
    maxHeight: "45vh",
    overflowY: "auto",
    marginBottom: theme.spacing(2),
  },
  userAvatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(1),
  },
}));

export default function AddContactDialogue({
  open,
  handleToggle,
}: Props): ReactElement {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [contactName, setContactName] = useState<string>("");

  const classes = useStyles();
  const { user } = useAuth();
  const { usersMap, fetchAndMapUsers } = useUsersMap();
  const socket = useSocket();

  useEffect(() => {
    async function fetchUsers() {
      if (!user) return;

      const usersRef = database.collection("users");
      const snapshot = await usersRef.where("uid", "!=", user.uid).get();

      const usersList: UserType[] = [];
      const memberUids: string[] = [];
      snapshot.forEach((doc) => {
        const { email, displayName, imageUrl } = doc.data();
        usersList.push({
          uid: doc.id,
          email,
          displayName,
          imageUrl,
        });
        memberUids.push(doc.id);
      });

      fetchAndMapUsers(memberUids);
      setUsers(usersList);
    }

    fetchUsers();
  }, [user]);

  function onCheckboxChangeHandler(user: UserType, selected: boolean) {
    let selectedUsersCopy = [...selectedUsers];
    if (selected) {
      selectedUsersCopy.splice(selectedUsersCopy.indexOf(user), 1);
    } else {
      selectedUsersCopy.push(user);
    }

    setSelectedUsers(selectedUsersCopy);
  }

  function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!contactName) return;
    if (selectedUsers.length === 0) return;
    if (!socket) return;

    const userUids: string[] = selectedUsers.map(({ uid }) => {
      return uid;
    });
    userUids.push(user.uid);

    const newContact = {
      name: contactName,
      members: userUids,
      createdAt: Date.now(),
      lastMessageDate: Date.now(),
      lastMessage: {
        sender: "Bot",
        text: "Contact created",
      },
      seenBy: [],
    };

    socket.emit("new-contact", newContact);

    handleToggle();
    setSelectedUsers([]);
    setContactName("");
  }

  const formValid: boolean = contactName && selectedUsers.length ? true : false;

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="sm">
      <DialogTitle className={classes.dialogHeader}>Add a contact</DialogTitle>

      <form onSubmit={onSubmitHandler}>
        <DialogContent>
          <Input
            value={contactName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setContactName(e.target.value);
            }}
            placeholder="Contact name"
            fullWidth
            required
          />

          <List className={classes.usersList}>
            {users.map((user) => {
              const selected = selectedUsers.includes(user);
              return (
                <ListItem
                  key={user.uid}
                  button
                  divider
                  onClick={() => onCheckboxChangeHandler(user, selected)}
                >
                  <ListItemAvatar>
                    <Avatar
                      className={classes.userAvatar}
                      src={
                        usersMap[user.uid]
                          ? usersMap[user.uid].imageUrl
                          : undefined
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="h6">{user.displayName}</Typography>
                    }
                  />
                  <ListItemIcon>
                    <Checkbox checked={selected} />
                  </ListItemIcon>
                </ListItem>
              );
            })}
          </List>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!formValid}
          >
            Submit
          </Button>
        </DialogContent>
      </form>
    </Dialog>
  );
}
