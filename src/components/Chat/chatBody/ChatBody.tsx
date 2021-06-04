import { ReactElement, useEffect, useState, useRef } from "react";
import { Grid, makeStyles, TextField } from "@material-ui/core";
import { ContactType } from "../contacts/Contacts";
import { useAuth } from "../../../contexts/AuthContext";
import { database } from "../../../firebase";
import Message, { MessageType } from "./Message";

interface Props {
  contactProp: ContactType | null;
}

const useStyles = makeStyles({
  gridContainer: {
    backgroundColor: "lightgray",
    height: "100%",
    padding: 6,
  },
  chatMessagesDiv: {
    backgroundColor: "lightblue",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  chatInput: {
    backgroundColor: "lightyellow",
  },
});

export default function ChatBody({ contactProp }: Props): ReactElement {
  const classes = useStyles();
  const { user } = useAuth();
  const [contact, setContact] = useState<ContactType | null>(contactProp);
  const [messages, setMessages] = useState<MessageType[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const chatFormSubmitHandler = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("You must be logged in!");
    if (!inputRef.current) return;
    if (!contact) return;

    const newMessage = {
      contactKey: contact.key,
      sender: user.uid,
      text: inputRef.current.value,
      createdAt: Date.now(),
    };
    database.ref("messages").push(newMessage);
    inputRef.current.value = "";
  };

  useEffect(() => {
    setContact(contactProp);
    const messagesRef = database.ref("messages");
    messagesRef.on("value", (snapshot) => {
      let fetchedMessages: MessageType[] = [];
      snapshot.forEach((childSnapshot) => {
        fetchedMessages.push({
          key: childSnapshot.key,
          ...childSnapshot.val(),
        });
      });
      setMessages(fetchedMessages);
    });

    // return messagesRef.off();
  }, [contactProp]);

  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      className={classes.gridContainer}
    >
      {contact && contact.name}
      <Grid container className={classes.chatMessagesDiv}>
        {/* {messages.map(message=> <Grid item key={message.key}><Message  /><Grid/>)} */}
        {messages.map((message) => (
          <Grid item key={message.key}>
            <Message message={message} isOwn={message.sender === user?.uid} />
          </Grid>
        ))}
      </Grid>
      <form onSubmit={chatFormSubmitHandler}>
        <Grid item>
          <TextField
            inputRef={inputRef}
            variant="filled"
            fullWidth
            margin="dense"
            color="primary"
            rows={4}
            className={classes.chatInput}
          />
        </Grid>
      </form>
    </Grid>
  );
}
