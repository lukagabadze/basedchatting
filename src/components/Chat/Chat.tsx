import React, { ReactElement } from "react";

interface Props {}

export default function Chat({}: Props): ReactElement {
  return <div style={{ backgroundColor: "red", flexGrow: 1 }}>The Chat</div>;
}
