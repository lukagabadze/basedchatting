import React, { ReactElement } from "react";
import Body from "./components/body/Body";
import Header from "./components/header/Header";

interface Props {}

function App({}: Props): ReactElement {
  return (
    <div>
      <Header />
      <Body />
    </div>
  );
}

export default App;
