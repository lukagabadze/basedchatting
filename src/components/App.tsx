import Header from "./Header/Header";
import Auth from "./Auth/Auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { SocketProvider } from "../contexts/SocketContext";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Header />
          <Switch>
            <Route path="/auth">
              <Auth />
            </Route>
          </Switch>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
