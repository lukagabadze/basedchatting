import React, { ReactElement } from "react";

interface Props {
  text: string;
}

function Message({ text }: Props): ReactElement {
  return (
    <div className="bg-gray-500 max-w-min border-2 border-black px-2 py-1 rounded-md">
      <p className="truncate">{text}</p>
    </div>
  );
}

export default Message;
