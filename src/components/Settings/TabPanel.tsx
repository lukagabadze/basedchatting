import React, { ReactElement } from "react";

interface Props {
  children?: React.ReactNode;
  index: number;
  value: number;
}

export default function TabPanel({
  children,
  index,
  value,
}: Props): ReactElement {
  return <div hidden={value !== index}>{index === value && children}</div>;
}
