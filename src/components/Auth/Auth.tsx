import { ReactElement } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import Login from "./Login";
import Signup from "./Signup";

export default function Auth(): ReactElement {
  const { user } = useAuth();

  return (
    <Switch>
      {user && <Redirect to="" />}
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
