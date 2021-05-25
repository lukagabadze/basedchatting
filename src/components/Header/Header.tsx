import {
  AppBar,
  Button,
  CssBaseline,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ReactElement } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
    cursor: "pointer",
  },
  authDiv: {
    flex: "none",
    display: "flex",
    alignItems: "center",
  },
  button: {
    margin: "15px",
  },
});

export default function Header(): ReactElement {
  const classes = useStyles();
  const { user, logout } = useAuth();
  const history = useHistory();

  return (
    <CssBaseline>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography
            variant="h4"
            className={classes.title}
            onClick={() => history.push("/")}
          >
            BasedChatting
          </Typography>
          {user ? (
            <div className={classes.authDiv}>
              <Typography variant="h6" align="center">
                {user && user.email}
              </Typography>
              <Button
                variant="contained"
                className={classes.button}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className={classes.authDiv}>
              <Link to="/auth/login">
                <Button variant="contained" className={classes.button}>
                  Login
                </Button>
              </Link>
              <Link to="/auth/signup">
                <Button variant="contained" className={classes.button}>
                  Signup
                </Button>
              </Link>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </CssBaseline>
  );
}
