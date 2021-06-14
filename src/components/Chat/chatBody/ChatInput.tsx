import React, { ReactElement, useRef } from "react";
import { makeStyles, TextField } from "@material-ui/core";
import { ContactType } from "../contacts/Contacts";
import { useAuth } from "../../../contexts/AuthContext";
import { database } from "../../../firebase";

const useStyles = makeStyles({
  chatInput: { backgroundColor: "white" },
});

interface Props {
  contact: ContactType;
}

export default function ChatInput({ contact }: Props): ReactElement {
  const inputRef = useRef<HTMLInputElement>(null);

  const classes = useStyles();
  const { user } = useAuth();

  const chatFormSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!contact) return;
    if (!inputRef.current) return;

    const text = inputRef.current.value;
    inputRef.current.value = "";

    const newMessage = {
      text,
      sender: user.uid,
      contactId: contact.id,
      createdAt: Date.now(),
    };
    await database.collection(`messages`).add(newMessage);
  };

  return (
    <form onSubmit={chatFormSubmitHandler}>
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
    </form>
  );
}
