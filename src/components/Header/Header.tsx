import {
  AppBar,
  Button,
  CssBaseline,
  makeStyles,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import { ReactElement } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
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
    marginLeft: "10px",
  },
}));

export default function Header(): ReactElement {
  const { user, logout } = useAuth();
  const history = useHistory();

  const classes = useStyles();
  const theme = useTheme();

  const sm = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <CssBaseline>
      <AppBar className={classes.appBar} position="sticky" color="primary">
        <Toolbar>
          {/* The header */}
          <Typography
            variant={sm ? "h4" : "h6"}
            className={classes.title}
            onClick={() => history.push("/")}
          >
            BasedChatting
          </Typography>
          {user ? (
            <div className={classes.authDiv}>
              {/* The settings button */}
              <IconButton
                color="inherit"
                onClick={() => history.push("/settings")}
              >
                <AccountCircleIcon fontSize="large" />
              </IconButton>

              {/* Display user */}
              <Typography
                variant={sm ? "h6" : "body1"}
                hidden={!sm}
                align="center"
              >
                {user && user.displayName}
              </Typography>

              {/* Button to logout */}
              <Button
                variant="contained"
                size={sm ? "medium" : "small"}
                className={classes.button}
                onClick={logout}
              >
                Logout
              </Button>
            </div>
          ) : (
            <div className={classes.authDiv}>
              {/* Login route button */}
              <Link to="/auth/login">
                <Button variant="contained" className={classes.button}>
                  Login
                </Button>
              </Link>

              {/* Signup route button */}
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
