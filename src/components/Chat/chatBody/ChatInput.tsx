import React, { ReactElement, useRef } from "react";
import { IconButton, makeStyles, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import ImageIcon from "@material-ui/icons/Image";
import { useAuth } from "../../../contexts/AuthContext";
import { useSocket } from "../../../contexts/SocketContext";
import { ContactType } from "../../../hooks/useFetchContacts";

const useStyles = makeStyles({
  inputWrapper: {
    display: "flex",
  },
  chatInput: { backgroundColor: "white" },
  fileInput: {
    display: "none",
  },
});

interface Props {
  contact: ContactType;
}

export default function ChatInput({ contact }: Props): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  const classes = useStyles();
  const { user } = useAuth();
  const socket = useSocket();

  const chatFormSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!contact) return;
    if (!inputRef.current) return;
    if (!socket) return;

    const text = inputRef.current.value;
    inputRef.current.value = "";

    const newMessage = {
      text,
      sender: user.uid,
      contactId: contact.id,
      createdAt: Date.now(),
      members: contact.members,
    };

    socket.emit("new-message", newMessage);
  };

  return (
    <form className={classes.inputWrapper} onSubmit={chatFormSubmitHandler}>
      <input
        accept="image/"
        className={classes.fileInput}
        id="image-input"
        type="file"
      />
      <label htmlFor="image-input">
        <IconButton color="secondary" component="span">
          <ImageIcon />
        </IconButton>
      </label>

      <TextField
        inputRef={inputRef}
        variant="outlined"
        fullWidth
        margin="dense"
        color="primary"
        rows={4}
        required
        InputProps={{ className: classes.chatInput }}
      />
      <IconButton color="secondary" type="submit">
        <SendIcon />
      </IconButton>
    </form>
  );
}
