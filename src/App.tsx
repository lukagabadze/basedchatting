import React, { ReactElement } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Auth from "./components/Auth/Auth";
import Body from "./components/body/Body";
import Header from "./components/header/Header";

interface Props {}

function App({}: Props): ReactElement {
  return (
    <Router>
      <Route exact path="/">
        <Header />
        <Body />
      </Route>
      <Route path="/auth">
        <Auth />
      </Route>
    </Router>
  );
}

export default App;
