import { ReactElement, useRef, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useAvatar } from "../../../contexts/AvatarContext";
import Message, { MessageType } from "./Message";

interface Props {
  messages: MessageType[];
}

export default function Messages({ messages }: Props): ReactElement {
  const chatDivRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { userAvatarMap } = useAvatar();

  useEffect(() => {
    // Scroll the user to the bottom
    if (chatDivRef.current) {
      chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatDivRef} style={{ overflowY: "auto", height: "100%" }}>
      {messages &&
        messages.map((message) => {
          return (
            <Message
              key={message.id}
              isOwn={message.sender === user?.uid}
              message={message}
              userImageUrl={userAvatarMap[message.sender]}
            />
          );
        })}
    </div>
  );
}
