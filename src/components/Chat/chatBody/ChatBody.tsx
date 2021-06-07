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
      text: inputRef.current.value,
      sender: user.uid,
      contactId: contact.id,
      createdAt: Date.now(),
    };
    database.collection(`messages`).add(newMessage);
    inputRef.current.value = "";
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
          <Grid item key={message.id}>
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
