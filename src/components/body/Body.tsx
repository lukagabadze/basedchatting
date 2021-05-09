import React, { ReactElement } from "react";
import Chat from "./chat/Chat";

interface Props {}

function Body({}: Props): ReactElement {
  return (
    <div className="p-10">
      <div className="bg-indigo-400 h-4/5 flex flex-col space-y-5">
        <Chat />
      </div>
    </div>
  );
}

export default Body;
