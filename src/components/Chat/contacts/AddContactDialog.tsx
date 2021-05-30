import { ReactElement } from "react";
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
  Typography,
} from "@material-ui/core";
import { useQuery } from "react-query";

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

export type User = {
  uid: string;
  email: string;
};

export default function AddContactDialogue({
  open,
  handleToggle,
}: Props): ReactElement {
  const classes = useStyles();

  const { isLoading, data: users } = useQuery<User[]>(["users"], async () => {
    const res = await axios.get("http://localhost:4000/user/all");
    const users = res.data;
    return users;
  });

  return (
    <Dialog open={open} onClose={handleToggle}>
      <DialogTitle>Add a contact</DialogTitle>
      <DialogContent>
        <TextField label="Users" fullWidth></TextField>
      </DialogContent>
      <List className={classes.usersList}>
        {isLoading ? (
          <Typography variant="h6">Loading...</Typography>
        ) : (
          users &&
          users.map((user) => {
            return (
              <Button key={user.uid} fullWidth>
                <ListItem>
                  <ListItemText>{user.email}</ListItemText>
                </ListItem>
              </Button>
            );
          })
        )}
      </List>
    </Dialog>
  );
}
