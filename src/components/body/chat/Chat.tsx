import { ReactElement, useState, useEffect } from "react";
import socketio from "socket.io-client";
import { IMessage } from "../../../models/Message";
import Messages from "./Messages";

const ENDPOINT = "http://localhost:4000";

const socket = socketio(ENDPOINT, { transports: ["websocket"] });

const initialForm = "";
function Chat(): ReactElement {
  const [form, setForm] = useState(initialForm);
  const [newMessage, setNewMessage] = useState<IMessage>();

  const submitMessage = () => {
    socket.emit("message", form);
  };

  useEffect(() => {
    socket.on("messageSuccess", (msg) => {
      setNewMessage(msg);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="border-2 border-white">
      <Messages newMessage={newMessage} />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setForm(initialForm);
          submitMessage();
        }}
      >
        <input
          type="text"
          placeholder="Send a message..."
          className="w-full text-black border-2 border-black"
          value={form}
          onChange={(e) => setForm(e.target.value)}
        />
      </form>
    </div>
  );
}

export default Chat;
