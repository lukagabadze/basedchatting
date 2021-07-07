import { ReactElement, useRef, useEffect, useCallback, useState } from "react";
import { Avatar, makeStyles, Typography } from "@material-ui/core";
import { useAuth } from "../../../contexts/AuthContext";
import Message from "./Message";
import { MessageType } from "../../../hooks/useFetchMessage";
import { useUsersMap } from "../../../contexts/UsersMapContext";

const useStyles = makeStyles((theme) => ({
  chatDiv: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "column-reverse",
    padding: theme.spacing(1),
  },
  isTypingDiv: {
    display: "flex",
    alignItems: "center",
  },
  isTypingText: {
    marginLeft: theme.spacing(1),
  },
}));

interface Props {
  messages: MessageType[];
  usersTyping: string[];
  fetchOldMessages(
    lastMessage: MessageType,
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
  ): void;
  firstMessage: HTMLDivElement | null;
  setFirstMessage: React.Dispatch<React.SetStateAction<HTMLDivElement | null>>;
}

export default function Messages({
  messages,
  usersTyping,
  fetchOldMessages,
  firstMessage,
  setFirstMessage,
}: Props): ReactElement {
  const [prevMessage, setPrevMessage] = useState<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const loadingRef = useRef<HTMLDivElement | null>(null);

  const classes = useStyles();
  const { user } = useAuth();
  const { usersMap } = useUsersMap();

  useEffect(() => {
    // Scroll the user to the bottom
    if (firstMessage) {
      firstMessage.scrollIntoView();
    }
  }, [firstMessage, usersTyping]);

  useEffect(() => {
    if (prevMessage) {
      prevMessage.scrollIntoView();
    }
  }, [prevMessage]);

  useEffect(() => {
    if (loadingRef.current) {
      loadingRef.current.scrollIntoView();
    }
  }, [loading]);

  const observer = useRef<IntersectionObserver>();
  const lastMessageRef = useCallback(
    (node: HTMLDivElement) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && messages) {
          setPrevMessage(node);
          fetchOldMessages(messages[messages.length - 1], setLoading);

          // es araironiulad production build-shi unda iyos
          console.log("ait... daginaxee");
        }
      });

      if (node) observer.current.observe(node);
    },
    [messages, fetchOldMessages]
  );

  return (
    <div className={classes.chatDiv}>
      {usersTyping.map((user) => {
        return (
          <div key={user} className={classes.isTypingDiv}>
            <Avatar src={usersMap[user]?.imageUrl} />
            <Typography className={classes.isTypingText}>
              {usersMap[user]?.senderName} is typing...
            </Typography>
          </div>
        );
      })}
      {messages &&
        messages.map((message, ind) => {
          return (
            <div
              ref={
                ind === messages.length - 1
                  ? lastMessageRef
                  : ind === 0
                  ? (newRef) => setFirstMessage(newRef)
                  : undefined
              }
              key={message.id}
            >
              {(message.text || message.imageUrl) && (
                <Message
                  isOwn={message.sender === user?.uid}
                  message={message}
                  userImageUrl={usersMap[message.sender]?.imageUrl}
                  userName={usersMap[message.sender]?.senderName}
                />
              )}
            </div>
          );
        })}
      {loading && (
        <div ref={loadingRef}>
          <Typography variant="h4" align="center">
            Loading...
          </Typography>
        </div>
      )}
    </div>
  );
}
