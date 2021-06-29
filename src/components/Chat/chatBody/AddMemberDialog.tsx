import { ReactElement, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  makeStyles,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
} from "@material-ui/core";
import { useAuth, UserType } from "../../../contexts/AuthContext";
import { useUsersMap } from "../../../contexts/UsersMapContext";
import { database } from "../../../firebase";

const useStyles = makeStyles((theme) => ({
  dialogHeader: {
    marginTop: theme.spacing(1),
  },
  dialogContent: {
    display: "flex",
    flexDirection: "column",
  },
}));

interface Props {
  open: boolean;
  handleClose: () => void;
}

export default function AddMemberDialog({
  open,
  handleClose,
}: Props): ReactElement {
  const [users, setUsers] = useState<UserType[]>([]);

  const { user } = useAuth();
  const { usersMap, fetchAndMapUsers } = useUsersMap();
  const classes = useStyles();

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
  }, []);

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <Typography className={classes.dialogHeader} align="center" variant="h4">
        Add member
      </Typography>

      <DialogContent>
        <List>
          {users.map((user) => {
            return (
              <ListItem divider button>
                <ListItemAvatar>
                  <Avatar src={usersMap[user.uid].imageUrl} />
                </ListItemAvatar>
                <ListItemText
                  primary={<Typography noWrap>{user.displayName}</Typography>}
                />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
    </Dialog>
  );
}
