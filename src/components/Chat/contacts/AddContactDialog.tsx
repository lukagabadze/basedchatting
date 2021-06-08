import React, { ReactElement, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogTitle,
  Input,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { database } from "../../../firebase";
import { useAuth, UserType } from "../../../contexts/AuthContext";

interface Props {
  open: boolean;
  handleToggle: () => void;
}

const useStyles = makeStyles({
  dialogHeader: {
    margin: "auto",
  },
  usersList: {
    maxHeight: "45vh",
    overflowY: "auto",
  },
});

export default function AddContactDialogue({
  open,
  handleToggle,
}: Props): ReactElement {
  const { user } = useAuth();
  const classes = useStyles();
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const [contactName, setContactName] = useState<string>("");

  useEffect(() => {
    async function fetchUsers() {
      if (!user) return;

      const usersRef = database.collection("users");
      const snapshot = await usersRef.where("uid", "!=", user.uid).get();

      let usersList: UserType[] = [];
      snapshot.forEach((doc) => {
        const { email, displayName } = doc.data();
        usersList.push({
          uid: doc.id,
          email,
          displayName,
        });
      });
      setUsers(usersList);
    }

    fetchUsers();
  }, []);

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

    const userUids: string[] = [];
    selectedUsers.map(({ uid }) => {
      userUids.push(uid);
    });
    userUids.push(user.uid);

    const newContact = {
      name: contactName,
      members: userUids,
      createdAt: Date.now(),
    };

    const contactRef = database.collection("contacts");
    contactRef.add(newContact);

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
                  onClick={() => onCheckboxChangeHandler(user, selected)}
                >
                  <ListItemIcon>
                    <Checkbox checked={selected} />
                  </ListItemIcon>
                  <ListItemText primary={user.displayName} />
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
