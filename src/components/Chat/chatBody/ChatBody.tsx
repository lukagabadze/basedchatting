import React, { ReactElement, useEffect, useState, useRef } from "react";
import { Box, makeStyles, TextField, Typography } from "@material-ui/core";
import { ContactType } from "../contacts/Contacts";
import { useAuth } from "../../../contexts/AuthContext";
import { database } from "../../../firebase";
import Message, { MessageType } from "./Message";
import { contactsWidth } from "../contacts/Contacts";

interface Props {
  contactProp: ContactType | null;
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
    overflowY: "scroll",
  },
  chatInputDiv: {
    marginLeft: 10,
    marginRight: 10,
  },
  chatInput: { backgroundColor: "white" },
});

export default function ChatBody({ contactProp }: Props): ReactElement {
  const classes = useStyles();
  const { user } = useAuth();
  const [contact, setContact] = useState<ContactType | null>(contactProp);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatDivRef = useRef<HTMLDivElement>(null);

  const chatFormSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in!");
    if (!contact) return;
    if (!inputRef.current) return;
    if (!chatDivRef.current) return;

    const text = inputRef.current.value;
    inputRef.current.value = "";

    const newMessage = {
      text,
      sender: user.uid,
      contactId: contact.id,
      createdAt: Date.now(),
    };
    await database.collection(`messages`).add(newMessage);
    chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
  };

  useEffect(() => {
    setContact(contactProp);

    async function fetchMessages() {
      if (!contactProp) return;

      const messagesRef = database.collection("messages");
      messagesRef
        .where("contactId", "==", contactProp.id)
        .orderBy("createdAt", "asc")
        .onSnapshot((docSnap) => {
          let messagesList: MessageType[] = [];
          docSnap.forEach((doc) => {
            const { text, sender, contactId, createdAt } = doc.data();
            messagesList.push({
              id: doc.id,
              text,
              sender,
              contactId,
              createdAt,
            });
          });

          setMessages(messagesList);
        });
    }

    fetchMessages();
  }, [contactProp]);

  return (
    <Box height="100%" className={classes.gridContainer}>
      {/* The Header */}
      <Typography variant="h5" className={classes.chatHeader}>
        {contact && contact.name}
      </Typography>

      {/* The Body */}
      <div ref={chatDivRef} className={classes.chatMessagesDiv}>
        {messages.map((message) => (
          <Message
            key={message.id}
            message={message}
            isOwn={message.sender === user?.uid}
          />
        ))}
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
