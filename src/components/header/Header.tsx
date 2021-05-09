import React, { ReactElement } from "react";

interface Props {}

function Header({}: Props): ReactElement {
  return (
    <header className="bg-indigo-500 p-2">
      <p className="text-3xl">Based Chatting</p>
    </header>
  );
}

export default Header;
