import {
  RefObject,
  ReactElement,
  useEffect,
  useState,
  useCallback,
} from "react";
import {
  IconButton,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import MenuIcon from "@material-ui/icons/Menu";
import { contactsWidth } from "../contacts/Contacts";
import Messages from "./Messages";
import ChatInput from "./ChatInput";
import { ContactType } from "../../../hooks/useFetchContacts";
import { MessagesType, MessageType } from "../../../hooks/useFetchMessage";
import ContactSettingsDrawer from "./ContactSettingsDrawer";

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    width: "100vw",
    maxHeight: "100%",
    zIndex: 100,
    backgroundColor: theme.palette.background.default,
  },
  offset: theme.mixins.toolbar,
  chatHeader: {
    backgroundColor: theme.palette.secondary.main,
    color: "white",
    padding: theme.spacing(1),
    borderBottom: "1px solid black",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flex: "none",
  },
  headerLeft: {
    maxWidth: "80vw",
    display: "flex",
    alignItems: "center",
    textOverflow: "ellipsis",
  },
  drawerIcon: {
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
    flex: "none",
    marginTop: "auto",
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  openDrawer: {
    cursor: "pointer",
    marginRight: theme.spacing(2),
  },
}));

interface Props {
  contactProp: ContactType;
  messages: MessagesType;
  loading: boolean;
  fetchOldMessages(lastMessage: MessageType): void;
  chatDivRef: RefObject<HTMLDivElement>;
  handleDrawerOpen: () => void;
}

export default function ChatBody({
  contactProp,
  messages,
  loading,
  fetchOldMessages,
  chatDivRef,
  handleDrawerOpen,
}: Props): ReactElement {
  const [contact, setContact] = useState<ContactType | null>(contactProp);
  const [open, setOpen] = useState<boolean>(false);

  const classes = useStyles();
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));

  useEffect(() => {
    setContact(contactProp);
  }, [contactProp]);

  const drawerOpenHandler = useCallback(() => {
    setOpen(true);
  }, [setOpen]);
  const drawerCloseHandler = useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  return (
    <div
      className={classes.gridContainer}
      style={
        md
          ? {
              marginLeft: contactsWidth,
              width: `calc(100vw - ${contactsWidth}px)`,
            }
          : undefined
      }
    >
      <div className={classes.offset} />

      {/* The Header */}
      <div className={classes.chatHeader}>
        <div className={classes.headerLeft}>
          {!md && (
            <IconButton
              className={classes.drawerIcon}
              onClick={handleDrawerOpen}
            >
              <ArrowBackIcon />
            </IconButton>
          )}
          <Typography variant="h6" noWrap>
            {contact && contact.name}
          </Typography>
        </div>
        {/* <IconButton color="inherit" 
        > */}
        <MenuIcon
          className={classes.openDrawer}
          onClick={drawerOpenHandler}
          fontSize={md ? "large" : "default"}
        />
        {/* </IconButton> */}
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

      <div className={classes.chatInputDiv}>
        {contact && <ChatInput contact={contact} />}
      </div>

      {/* Contact settings drawer */}
      {contact && (
        <ContactSettingsDrawer
          open={open}
          handleClose={drawerCloseHandler}
          contact={contact}
        />
      )}
    </div>
  );
}
