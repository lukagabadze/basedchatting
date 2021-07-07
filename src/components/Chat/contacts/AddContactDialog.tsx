import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  makeStyles,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import { database } from "../../../firebase";
import { useAuth, UserType } from "../../../contexts/AuthContext";
import { useSocket } from "../../../contexts/SocketContext";
import { useUsersMap } from "../../../contexts/UsersMapContext";
import clsx from "clsx";

interface Props {
  open: boolean;
  handleToggle: () => void;
}

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    backgroundColor: theme.palette.secondary.dark,
  },
  dialogHeader: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: theme.spacing(2),
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
    color: "white",
  },
  usersList: {
    maxHeight: "45vh",
    overflowY: "scroll",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  usersListItem: {
    marginBottom: theme.spacing(1),
    color: "white",
  },
  userSelected: {
    backgroundColor: theme.palette.primary.light,
    color: "white",
    "&:hover": {
      backgroundColor: theme.palette.primary.light,
    },
  },
  contactName: {
    color: "white",
  },
  notchedOutline: {
    borderWidth: "1px",
    borderColor: "white !important",
  },
  userAvatar: {
    width: theme.spacing(6),
    height: theme.spacing(6),
    marginRight: theme.spacing(1),
  },
  smallUserAvatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    marginRight: 0,
  },
}));

export default function AddContactDialogue({
  open,
  handleToggle,
}: Props): ReactElement {
  const [users, setUsers] = useState<UserType[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<UserType[]>([]);
  const nameRef = useRef<HTMLInputElement | null>(null);

  const classes = useStyles();
  const { user } = useAuth();
  const { usersMap, fetchAndMapUsers } = useUsersMap();
  const socket = useSocket();
  const theme = useTheme();

  const sm = useMediaQuery(theme.breakpoints.up("sm"));

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
  }, [user, fetchAndMapUsers]);

  const onCheckboxChangeHandler = useCallback(
    (user: UserType, selected: boolean) => {
      let selectedUsersCopy = [...selectedUsers];
      if (selected) {
        selectedUsersCopy.splice(selectedUsersCopy.indexOf(user), 1);
      } else {
        selectedUsersCopy.push(user);
      }

      setSelectedUsers(selectedUsersCopy);
    },
    [selectedUsers, setSelectedUsers]
  );

  function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!nameRef.current) return;
    if (selectedUsers.length === 0) return;
    if (!socket) return;
    if (!open) return;

    const userUids: string[] = selectedUsers.map(({ uid }) => {
      return uid;
    });
    userUids.push(user.uid);

    const newContact = {
      name: nameRef.current.value,
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
  }

  const formValid: boolean =
    nameRef.current && selectedUsers.length ? true : false;

  return (
    <Dialog
      open={open}
      onClose={handleToggle}
      fullWidth
      maxWidth="sm"
      classes={{ paper: classes.dialogPaper }}
    >
      <form onSubmit={onSubmitHandler}>
        <div className={classes.dialogHeader}>
          <Typography align="center" variant="h4">
            Add a contact
          </Typography>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={!formValid}
          >
            Submit
          </Button>
        </div>

        <DialogContent>
          <Typography className={classes.contactName} variant="h6">
            Contact name:
          </Typography>
          <TextField
            inputRef={nameRef}
            InputProps={{
              className: classes.contactName,
              classes: {
                notchedOutline: classes.notchedOutline,
              },
            }}
            InputLabelProps={{
              className: classes.contactName,
            }}
            variant="outlined"
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
                  className={clsx(
                    classes.usersListItem,
                    selected && classes.userSelected
                  )}
                  onClick={() => onCheckboxChangeHandler(user, selected)}
                  button
                  divider
                >
                  <ListItemAvatar>
                    <Avatar
                      className={clsx(
                        classes.userAvatar,
                        !sm && classes.smallUserAvatar
                      )}
                      src={
                        usersMap[user.uid]
                          ? usersMap[user.uid].imageUrl
                          : undefined
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography noWrap variant="body1">
                        {user.displayName}
                      </Typography>
                    }
                  />
                  <ListItemIcon>
                    <Checkbox style={{ color: "white" }} checked={selected} />
                  </ListItemIcon>
                </ListItem>
              );
            })}
          </List>
        </DialogContent>
      </form>
    </Dialog>
  );
}
