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
    justifyContent: "space-between",
    width: "100vw",
    height: `calc(100% - ${theme.spacing(2)}px)`,
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
  firstMessageRef: RefObject<HTMLDivElement>;
  handleDrawerOpen: () => void;
}

export default function ChatBody({
  contactProp,
  messages,
  loading,
  fetchOldMessages,
  firstMessageRef,
  handleDrawerOpen,
}: Props): ReactElement {
  const [contact, setContact] = useState<ContactType | null>(contactProp);
  const [open, setOpen] = useState<boolean>(false);

  const classes = useStyles();
  const theme = useTheme();
  const md = useMediaQuery(theme.breakpoints.up("md"));
  const sm = useMediaQuery(theme.breakpoints.up("sm"));

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
          : !sm
          ? {
              marginTop: "3px",
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
          <Typography variant="body2" noWrap>
            {contact && contact.name}
          </Typography>
        </div>
        <MenuIcon
          className={classes.openDrawer}
          onClick={drawerOpenHandler}
          fontSize={md ? "large" : "default"}
        />
      </div>

      {/* The Messages */}
      <div className={classes.chatMessagesDiv}>
        {!loading ? (
          contact && (
            <Messages
              messages={messages[contact.id]}
              fetchOldMessages={fetchOldMessages}
              firstMessageRef={firstMessageRef}
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
