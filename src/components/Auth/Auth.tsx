import { ReactElement } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth(): ReactElement {
  return (
    <Switch>
      <Route exact path="/auth/login">
        <Login />
      </Route>
      <Route exact path="/auth/signup">
        <Signup />
      </Route>
      <Redirect from="/auth" to="/auth/login" />
    </Switch>
  );
}
