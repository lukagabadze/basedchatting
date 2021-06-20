import { RefObject, ReactElement, useRef, useEffect, useCallback } from "react";
import { makeStyles } from "@material-ui/core";
import { useAuth } from "../../../contexts/AuthContext";
import { useAvatar } from "../../../contexts/AvatarContext";
import Message from "./Message";
import { MessageType } from "../../../hooks/useFetchMessage";

const useStyles = makeStyles({
  chatDiv: {
    overflowY: "auto",
    height: "100%",
    display: "flex",
    flexDirection: "column-reverse",
  },
});

interface Props {
  messages: MessageType[];
  fetchOldMessages(lastMessage: MessageType): void;
  chatDivRef: RefObject<HTMLDivElement>;
}

export default function Messages({
  messages,
  fetchOldMessages,
  chatDivRef,
}: Props): ReactElement {
  const classes = useStyles();
  const { user } = useAuth();
  const { userAvatarMap } = useAvatar();

  useEffect(() => {
    // Scroll the user to the bottom
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [chatDivRef]);

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
    <div ref={chatDivRef} className={classes.chatDiv}>
      {messages &&
        messages.map((message, ind) => {
          return (
            <div
              ref={ind === messages.length - 1 ? lastMessageRef : null}
              key={message.id}
            >
              <Message
                isOwn={message.sender === user?.uid}
                message={message}
                userImageUrl={userAvatarMap[message.sender]}
              />
            </div>
          );
        })}
    </div>
  );
}
