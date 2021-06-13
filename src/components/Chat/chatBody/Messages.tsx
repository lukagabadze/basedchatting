import { Typography } from "@material-ui/core";
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
  const [loading, setLoading] = useState(false);
  const chatDivRef = useRef<HTMLDivElement>(null);

  const urlMap = useAvatar(contact.members);
  const { user } = useAuth();

  useEffect(() => {
    setLoading(true);
    setMessages([]);
    const messagesRef = database.collection("messages");
    const unsubscribe = messagesRef
      .where("contactId", "==", contact.id)
      .orderBy("createdAt", "desc")
      .limit(25)
      .onSnapshot((docSnap) => {
        let messagesList: MessageType[] = [];
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

        setLoading(false);
        setMessages(messagesList.reverse());
        // Scroll the user to the bottom
        if (chatDivRef.current) {
          chatDivRef.current.scrollTop = chatDivRef.current.scrollHeight;
        }
      });

    return unsubscribe;
  }, [contact]);

  return (
    <div ref={chatDivRef} style={{ overflowY: "auto", height: "100%" }}>
      {!loading ? (
        messages.map((message) => {
          return (
            <Message
              key={message.id}
              isOwn={message.sender === user?.uid}
              message={message}
              userImageUrl={urlMap[message.sender]}
            />
          );
        })
      ) : (
        <Typography variant="h4">Loading...</Typography>
      )}
    </div>
  );
}
