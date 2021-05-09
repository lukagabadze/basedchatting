import React, { ReactElement, useState, useEffect } from "react";
import socketio from "socket.io-client";

const ENDPOINT = "http://192.168.0.100:4000/";

interface Props {}

function Chat({}: Props): ReactElement {
  const [form, setForm] = useState("test");

  const socket = socketio(ENDPOINT);
  socket.on("message", () => {
    console.log("GTXOV BLIAD");
  });
  useEffect(() => {
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
