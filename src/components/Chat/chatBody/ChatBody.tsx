import { RefObject, ReactElement, useEffect, useState } from "react";
import { Box, makeStyles, Typography } from "@material-ui/core";
import { contactsWidth } from "../contacts/Contacts";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { ContactType } from "../../../hooks/useFetchContacts";
import { MessagesType, MessageType } from "../../../hooks/useFetchMessage";

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
});

interface Props {
  contactProp: ContactType;
  messages: MessagesType;
  loading: boolean;
  fetchOldMessages(lastMessage: MessageType): void;
  chatDivRef: RefObject<HTMLDivElement>;
}

export default function ChatBody({
  contactProp,
  messages,
  loading,
  fetchOldMessages,
  chatDivRef,
}: Props): ReactElement {
  const [contact, setContact] = useState<ContactType | null>(contactProp);

  const classes = useStyles();

  useEffect(() => {
    setContact(contactProp);
  }, [contactProp]);

  return (
    <Box height="100%" className={classes.gridContainer}>
      {/* The Header */}
      <Typography variant="h5" className={classes.chatHeader}>
        {contact && contact.name}
      </Typography>

      {/* The Messages */}
      <div className={classes.chatMessagesDiv}>
        {!loading ? (
          contact && (
            <Messages
              messages={messages[contact.id]}
              fetchOldMessages={fetchOldMessages}
              chatDivRef={chatDivRef}
            />
          )
        ) : (
          <Typography variant="h4">Loading...</Typography>
        )}
      </div>

      <Box className={classes.chatInputDiv}>
        {contact && <ChatInput contact={contact} />}
      </Box>
    </Box>
  );
}
