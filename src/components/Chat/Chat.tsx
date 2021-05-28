import { ReactElement, useEffect } from "react";
import Contacts from "./contacts/Contacts";
import ChatBody from "./chatBody/ChatBody";
import { Drawer } from "@material-ui/core";

interface Props {}

export default function Chat({}: Props): ReactElement {
  useEffect(() => {});
  return (
    <div style={{ height: "100%", display: "flex" }}>
      <div style={{ width: "300px" }}>
        <Contacts />
      </div>
      <div style={{ flexGrow: 1 }}>
        <ChatBody />
      </div>
    </div>
  );
}
