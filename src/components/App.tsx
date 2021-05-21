import Header from "./Header/Header";
import Auth from "./Auth/Auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Switch>
          <Route path="/auth">
            <Auth />
          </Route>
        </Switch>
      </Router>
    </AuthProvider>
  );
}

export default App;
