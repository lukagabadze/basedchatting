import Header from "./Header/Header";
import Auth from "./Auth/Auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Chat from "./Chat/Chat";
import PrivateRoute from "./PrivateRoute";
import Settings from "./Settings/Settings";

function App() {
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
            <Route path="/auth">
              <Auth />
            </Route>
            <PrivateRoute path="/settings" component={Settings} />
            <PrivateRoute path="/" component={Chat} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
