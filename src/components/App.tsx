import Header from "./Header/Header";
import Auth from "./Auth/Auth";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import Chat from "./Chat/Chat";
import PrivateRoute from "./PrivateRoute";
import Settings from "./Settings/Settings";
import { useAuth } from "../contexts/AuthContext";

function App() {
  const { user } = useAuth();

  return (
    <Router>
      <div
        style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Header />
        <div
          style={{
            flex: 1,
            overflowY: "auto",
          }}
        >
          <Switch>
            <PrivateRoute exact path="/settings" component={Settings} />
            <PrivateRoute exact path="/" component={Chat} />
            <Route
              path="/"
              render={() => {
                return !user ? <Auth /> : <Redirect to="/" />;
              }}
            />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
