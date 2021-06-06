import { ReactElement, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
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

  return (
    <Dialog open={open} onClose={handleToggle} fullWidth maxWidth="sm">
      <DialogTitle>Add a contact</DialogTitle>
      <DialogContent>
        <List className={classes.usersList}>
          {users.map((user) => {
            return (
              <ListItem key={user.uid} button onClick={() => {}}>
                <ListItemText primary={user.displayName} />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}
