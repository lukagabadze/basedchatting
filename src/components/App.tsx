import Header from "./Header/Header";
import Auth from "./Auth/Auth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { SocketProvider } from "../contexts/SocketContext";
import Chat from "./Chat/Chat";
import { QueryClient, QueryClientProvider } from "react-query";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import PrivateRoute from "./PrivateRoute";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffc942",
    },
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
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
                    <PrivateRoute path="" component={Chat} />
                  </Switch>
                </div>
              </div>
            </Router>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
