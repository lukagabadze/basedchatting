import { ReactElement, useRef, useCallback, useState } from "react";
import axios from "axios";
import firebase from "firebase";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  List,
  ListItem,
  ListItemText,
  makeStyles,
  Button,
  Typography,
  IconButton,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import { useQuery } from "react-query";
import { database } from "../../../firebase";
import { useAuth } from "../../../contexts/AuthContext";

const useStyles = makeStyles({
  usersList: {
    maxHeight: "30vh",
    overflowY: "auto",
  },
  userButton: {
    textTransform: "none",
  },
});

interface Props {
  open: boolean;
  handleToggle: () => void;
}

export type User = {
  uid: string;
  email: string;
};

export default function AddContactDialogue({
  open,
  handleToggle,
}: Props): ReactElement {
  const { user } = useAuth();
  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const [queryUsers, setQueryUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);

  const { isLoading, data: users } = useQuery<User[]>(["users"], async () => {
    const res = await axios.get("http://localhost:4000/user/users");
    return res.data;
  });

  const onFormSubmitHandler = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.get(
      `http://localhost:4000/user/users/${inputRef.current?.value}`
    );
    setQueryUsers(res.data);
  }, []);

  const onUserClickHandler = (userId: number) => {
    if (users && !selectedUsers.includes(users[userId])) {
      return setSelectedUsers([...selectedUsers, users[userId]]);
    }
  };

  const removeUserHandler = (userId: number) => {
    const selectedUsersCopy = [...selectedUsers];
    selectedUsersCopy.splice(userId, 1);
    setSelectedUsers(selectedUsersCopy);
  };

  const submitButtonHandler = () => {
    if (!user) {
      return alert("You must be logged in");
    }

    const selectedUsersUids = selectedUsers.map(
      (selectedUser) => selectedUser.uid
    );

    const newContact = {
      name: "New contact",
      members: selectedUsersUids,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    };

    const userContactsRef = database.ref("contacts");
    userContactsRef.push(newContact);

    setSelectedUsers([]);
    handleToggle();
  };

  const setOfUsers = queryUsers.length ? queryUsers : users;

  return (
    <Dialog open={open} onClose={handleToggle}>
      <DialogTitle>Add a contact</DialogTitle>

      <List className={classes.usersList}>
        {selectedUsers.map((user, ind) => {
          return (
            <ListItem key={user.uid}>
              <IconButton
                area-label="remove"
                size="small"
                onClick={() => removeUserHandler(ind)}
              >
                <CloseIcon color="secondary" />
              </IconButton>
              <ListItemText>{user.email}</ListItemText>
            </ListItem>
          );
        })}
      </List>

      <DialogContent>
        <form onSubmit={onFormSubmitHandler}>
          <TextField inputRef={inputRef} label="Users" fullWidth></TextField>
        </form>
      </DialogContent>

      <List className={classes.usersList}>
        {isLoading ? (
          <Typography variant="h6" align="center">
            Loading...
          </Typography>
        ) : (
          setOfUsers &&
          setOfUsers.map((user, ind) => {
            return (
              <Button
                key={user.uid}
                fullWidth
                onClick={() => onUserClickHandler(ind)}
                className={classes.userButton}
              >
                <ListItem>
                  <ListItemText>{user.email}</ListItemText>
                </ListItem>
              </Button>
            );
          })
        )}
      </List>
      <Button
        disabled={selectedUsers.length === 0}
        onClick={submitButtonHandler}
      >
        Submit
      </Button>
    </Dialog>
  );
}
