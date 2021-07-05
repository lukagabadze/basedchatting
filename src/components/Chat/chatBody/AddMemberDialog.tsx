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
import { useSocket } from "../../../contexts/SocketContext";

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
  contactId: string;
  members: string[];
}

export default function AddMemberDialog({
  open,
  handleClose,
  contactId,
  members,
}: Props): ReactElement {
  const [users, setUsers] = useState<UserType[]>([]);

  const { user } = useAuth();
  const { usersMap, fetchAndMapUsers } = useUsersMap();
  const socket = useSocket();
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
  }, [fetchAndMapUsers, user]);

  function userClickHandler(uid: string) {
    if (!socket) return;

    socket.emit("contact-update", {
      contactId: contactId,
      members: [...members, uid],
    });
    handleClose();
  }

  return (
    <Dialog fullWidth open={open} onClose={handleClose}>
      <Typography className={classes.dialogHeader} align="center" variant="h4">
        Add member
      </Typography>

      <DialogContent>
        <List>
          {users.map((user) => {
            if (members.includes(user.uid)) return null;

            return (
              <ListItem
                divider
                button
                onClick={() => userClickHandler(user.uid)}
              >
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
