import { ReactElement, useEffect, useState } from "react";
import axios from "axios";
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
} from "@material-ui/core";

export type User = {
  uid: string;
  email: string;
};

const useStyles = makeStyles({
  usersList: {
    maxHeight: "35vh",
    overflowY: "auto",
  },
});

interface Props {
  open: boolean;
  handleToggle: () => void;
}

export default function AddContactDialogue({
  open,
  handleToggle,
}: Props): ReactElement {
  const classes = useStyles();
  const [users, setUsers] = useState<Array<User>>([]);

  useEffect(() => {
    axios.get("http://localhost:4000/user/all").then((res) => {
      const users = res.data;
      setUsers(users);
    });
  }, []);

  return (
    <Dialog open={open} onClose={handleToggle}>
      <DialogTitle>Add a contact</DialogTitle>
      <DialogContent>
        <TextField label="Users" fullWidth></TextField>
      </DialogContent>
      <List className={classes.usersList}>
        {users.map((user) => {
          return (
            <Button fullWidth>
              <ListItem>
                <ListItemText key={user.uid}>{user.email}</ListItemText>
              </ListItem>
            </Button>
          );
        })}
      </List>
    </Dialog>
  );
}
