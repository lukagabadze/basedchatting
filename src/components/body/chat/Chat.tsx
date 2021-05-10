import React, { ReactElement, useState, useEffect } from "react";
import socketio from "socket.io-client";

const ENDPOINT = "http://localhost:4000";

interface Props {}

function Chat({}: Props): ReactElement {
  const [form, setForm] = useState("test");

  useEffect(() => {
    const socket = socketio(ENDPOINT, { transports: ["websocket"] });
    socket.on("message", () => {
      console.log("GTXOVVVVVVVVVVV");
    });
    console.log(socket);
    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div>
      <div className="flex flex-col space-y-2">
        <p>message 1 message 1 message 1 </p>
        <p>message 2 message 2 message 2 </p>
        <p>message 3 message 3 message 3 </p>
        <p>message 4 message 4 message 4 </p>
      </div>
      <div>
        <input
          type="text"
          className="w-full text-black"
          value={form}
          onChange={(e) => setForm(e.target.value)}
        />
      </div>
    </div>
  );
}

export default Chat;
