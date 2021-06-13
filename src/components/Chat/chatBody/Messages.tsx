import { ReactElement, useState, useRef, useEffect } from "react";
import { useAuth } from "../../../contexts/AuthContext";
import { useAvatar } from "../../../contexts/AvatarContext";
import { database } from "../../../firebase";
import { ContactType } from "../contacts/Contacts";
import Message, { MessageType } from "./Message";

interface Props {
  contact: ContactType;
}

export default function Messages({ contact }: Props): ReactElement {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const messagesRef = useRef<MessageType[]>([]);
  const chatDivRef = useRef<HTMLDivElement>(null);

  const urlMap = useAvatar(contact.members);
  const { user } = useAuth();

  useEffect(() => {
    const messagesRef = database.collection("messages");
    messagesRef
      .where("contactId", "==", contact.id)
      .orderBy("createdAt", "desc")
      .limit(25)
      .onSnapshot((docSnap) => {
        let messagesList: MessageType[] = [...messages];
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

        setMessages(messagesList.reverse());

        // Scroll the user to the bottom
        if (chatDivRef.current) {
          chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
        }
      });
  }, [contact]);

  return (
    <div ref={chatDivRef} style={{ overflowY: "auto", height: "100%" }}>
      {messages.map((message) => {
        return (
          <Message
            key={message.id}
            isOwn={message.sender === user?.uid}
            message={message}
            userImageUrl={urlMap[message.sender]}
          />
        );
      })}
    </div>
  );
}
