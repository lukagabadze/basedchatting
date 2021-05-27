import { ReactElement, useEffect } from "react";
import Contacts from "./contacts/Contacts";
import ChatBody from "./chatBody/ChatBody";

interface Props {}

export default function Chat({}: Props): ReactElement {
  useEffect(() => {});
  return (
    <div style={{ display: "flex", flexGrow: 1 }}>
      <div style={{ width: "300px" }}>
        <Contacts />
      </div>
      <div style={{ flexGrow: 1 }}>
        <ChatBody />
      </div>
    </div>
  );
}
