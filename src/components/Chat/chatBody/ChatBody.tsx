import { RefObject, ReactElement, useEffect, useState } from "react";
import {
  Box,
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import { contactsWidth } from "../contacts/Contacts";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { ContactType } from "../../../hooks/useFetchContacts";
import { MessagesType, MessageType } from "../../../hooks/useFetchMessage";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    display: "flex",
    flexDirection: "column",
    backgroundColor: theme.palette.background.default,
  },
  chatHeader: {
    backgroundColor: theme.palette.secondary.main,
    color: "white",
    padding: theme.spacing(1),
    borderBottom: "1px solid black",
    display: "flex",
    alignItems: "center",
  },
  drawerIcon: {
    // backgroundColor: "red",
    color: "white",
    height: theme.spacing(3),
    width: theme.spacing(3),
    marginRight: theme.spacing(1),
  },
  chatMessagesDiv: {
    flex: 1,
    overflowY: "auto",
  },
  chatInputDiv: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
}));

interface Props {
  contactProp: ContactType;
  messages: MessagesType;
  loading: boolean;
  fetchOldMessages(lastMessage: MessageType): void;
  chatDivRef: RefObject<HTMLDivElement>;
  handleDrawerOpen: () => void;
  handleDrawerClose: () => void;
}

export default function ChatBody({
  contactProp,
  messages,
  loading,
  fetchOldMessages,
  chatDivRef,
  handleDrawerClose,
  handleDrawerOpen,
}: Props): ReactElement {
  const [contact, setContact] = useState<ContactType | null>(contactProp);

  const classes = useStyles();
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    setContact(contactProp);
  }, [contactProp]);

  return (
    <Box
      height="100%"
      className={classes.gridContainer}
      style={md ? { marginLeft: contactsWidth } : undefined}
    >
      {/* The Header */}
      <div className={classes.chatHeader}>
        {!md && (
          <IconButton className={classes.drawerIcon} onClick={handleDrawerOpen}>
            <ArrowBackIcon />
          </IconButton>
        )}
        <Typography variant="h6" noWrap>
          {contact && contact.name}
        </Typography>
      </div>

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
