import { ReactElement, useRef, useEffect, useCallback } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useAvatar } from "../../../contexts/AvatarContext";
import Message, { MessageType } from "./Message";

interface Props {
  messages: MessageType[];
  fetchOldMessages(lastMessage: MessageType): void;
}

export default function Messages({
  messages,
  fetchOldMessages,
}: Props): ReactElement {
  const chatDivRef = useRef<HTMLDivElement>(null);

  const { user } = useAuth();
  const { userAvatarMap } = useAvatar();

  useEffect(() => {
    // Scroll the user to the bottom
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [messages]);

  const observer = useRef<IntersectionObserver>();
  const lastMessageRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && messages) {
          fetchOldMessages(messages[0]);

          // es araironiulad production build-shi unda iyos
          console.log("ait... daginaxee");
        }
      });

      if (node) observer.current.observe(node);
    },
    [messages, fetchOldMessages]
  );

  return (
    <div ref={chatDivRef} style={{ overflowY: "auto", height: "100%" }}>
      {messages &&
        messages.map((message, ind) => {
          return (
            <div ref={ind === 0 ? lastMessageRef : null} key={message.id}>
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
