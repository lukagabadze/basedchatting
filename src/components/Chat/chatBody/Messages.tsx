import { RefObject, ReactElement, useRef, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core";
import { useAuth } from "../../../contexts/AuthContext";
import Message from "./Message";
import { MessageType } from "../../../hooks/useFetchMessage";
import { useUsersMap } from "../../../contexts/UsersMapContext";

const useStyles = makeStyles({
  chatDiv: {
    overflowY: "auto",
    display: "flex",
    flexDirection: "column-reverse",
  },
});

interface Props {
  messages: MessageType[];
  fetchOldMessages(lastMessage: MessageType): void;
  firstMessageRef: RefObject<HTMLDivElement>;
}

export default function Messages({
  messages,
  fetchOldMessages,
  firstMessageRef,
}: Props): ReactElement {
  const classes = useStyles();
  const { user } = useAuth();
  const { usersMap } = useUsersMap();

  useEffect(() => {
    // Scroll the user to the bottom
    if (firstMessageRef.current) {
      firstMessageRef.current.scrollIntoView();
    }
  }, [firstMessageRef.current]);

  const observer = useRef<IntersectionObserver>();
  const lastMessageRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && messages) {
          fetchOldMessages(messages[messages.length - 1]);

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
      {messages &&
        messages.map((message, ind) => {
          return (
            <div
              ref={
                ind === messages.length - 1
                  ? lastMessageRef
                  : ind === 0
                  ? firstMessageRef
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
    </div>
  );
}
