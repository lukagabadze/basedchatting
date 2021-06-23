import React from "react";
import ReactDOM from "react-dom";
import App from "./components/App";
import { AuthProvider } from "./contexts/AuthContext";
import { SocketProvider } from "./contexts/SocketContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { createMuiTheme, ThemeProvider } from "@material-ui/core";
import UsersMapProvider from "./contexts/UsersMapContext";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#ffc942",
    },
    secondary: {
      main: "#00838f",
    },
  },
});

const queryClient = new QueryClient();

ReactDOM.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <SocketProvider>
            <UsersMapProvider>
              <App />
            </UsersMapProvider>
          </SocketProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>,
  document.getElementById("root")
);
