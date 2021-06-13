import React, { ReactElement, useEffect, useState, useRef } from "react";
import { Box, makeStyles, TextField, Typography } from "@material-ui/core";
import { ContactType } from "../contacts/Contacts";
import { useAuth } from "../../../contexts/AuthContext";
import { database } from "../../../firebase";
import { contactsWidth } from "../contacts/Contacts";
import Messages from "./Messages";

interface Props {
  contactProp: ContactType;
}

const useStyles = makeStyles({
  gridContainer: {
    marginLeft: contactsWidth,
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#d1d1d1",
  },
  chatHeader: {
    backgroundColor: "#9A9AA9",
    color: "white",
    padding: 6,
    borderBottom: "1px solid black",
  },
  chatMessagesDiv: {
    flex: 1,
    overflowY: "auto",
  },
  chatInputDiv: {
    marginLeft: 10,
    marginRight: 10,
  },
  chatInput: { backgroundColor: "white" },
});

export default function ChatBody({ contactProp }: Props): ReactElement {
  const [contact, setContact] = useState<ContactType | null>(contactProp);
  const inputRef = useRef<HTMLInputElement>(null);

  const classes = useStyles();
  const { user } = useAuth();

  useEffect(() => {
    setContact(contactProp);
  }, [contactProp]);

  const chatFormSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in!");
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
    <Box height="100%" className={classes.gridContainer}>
      {/* The Header */}
      <Typography variant="h5" className={classes.chatHeader}>
        {contact && contact.name}
      </Typography>

      {/* The Messages */}
      <div className={classes.chatMessagesDiv}>
        {contact && <Messages contact={contact} />}
      </div>

      {/* The Input */}
      <Box className={classes.chatInputDiv}>
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
      </Box>
    </Box>
  );
}
