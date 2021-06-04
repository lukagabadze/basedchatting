import { Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

export type MessageType = {
  key: string;
  text: string;
  sender: string;
  contactKey: string;
  createdAt: Date;
};

interface Props {
  message: MessageType;
  isOwn: boolean;
}

export default function Message({ message, isOwn }: Props): ReactElement {
  return (
    <Typography align={isOwn ? "right" : "left"}>{message.text}</Typography>
  );
}
