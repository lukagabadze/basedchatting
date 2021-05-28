import Header from "./Header/Header";
import Auth from "./Auth/Auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { SocketProvider } from "../contexts/SocketContext";
import Chat from "./Chat/Chat";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <div
            style={{
              height: "100vh",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Header />
            <div style={{ flexGrow: 1 }}>
              <Switch>
                <Route path="/auth">
                  <Auth />
                </Route>
                <Route path="/">
                  <Chat />
                </Route>
              </Switch>
            </div>
          </div>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
