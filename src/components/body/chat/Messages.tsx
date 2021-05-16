import React, { ReactElement, useEffect, useRef, useState } from "react";
import axios from "axios";
import Message from "./Message";

export interface Message {
  _id: string;
  text: string;
  author: string;
}

interface Props {
  newMessage?: Message;
}

function Messages({ newMessage }: Props): ReactElement {
  const [messages, setMessages] = useState<Array<Message>>([]);

  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const chatDiv = chatRef.current;
    if (chatDiv && messages[messages.length - 1] === newMessage)
      chatDiv.scrollTop = chatDiv?.scrollHeight - chatDiv?.clientHeight;
  }, [messages]);

  useEffect(() => {
    if (newMessage) setMessages([...messages, newMessage]);
  }, [newMessage]);

  useEffect(() => {
    const fetchMessages = async () => {
      const res = await axios.get("http://localhost:4000/chat/all");
      setMessages(res.data.messages);
    };
    fetchMessages();
  }, []);

  return (
    <div
      ref={chatRef}
      className="h-96 flex flex-col space-y-2 overflow-y-scroll p-2"
    >
      {messages.map((message) => {
        return <Message key={message._id} text={message.text} />;
      })}
    </div>
  );
}

export default Messages;
