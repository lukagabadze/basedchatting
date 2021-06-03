import { Typography } from "@material-ui/core";
import React, { ReactElement } from "react";

interface Props {
  name: string;
}

export default function Contact({ name }: Props): ReactElement {
  return <Typography>{name}</Typography>;
}
