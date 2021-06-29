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
  Avatar,
  MenuItem,
  MenuList,
  Popover,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import SettingsIcon from "@material-ui/icons/Settings";
import { ReactElement, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

const useStyles = makeStyles((theme) => ({
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  title: {
    flexGrow: 1,
    cursor: "pointer",
    marginRight: theme.spacing(1),
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
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);

  const { user, logout } = useAuth();
  const history = useHistory();
  const classes = useStyles();
  const theme = useTheme();

  const sm = useMediaQuery(theme.breakpoints.up("sm"));

  function handleMenuClick(e: React.MouseEvent<HTMLButtonElement>) {
    setAnchor(e.currentTarget);
  }

  function handleMenuClose() {
    setAnchor(null);
  }

  function handleSettings() {
    history.push("/settings");
    handleMenuClose();
  }

  function handleLogout() {
    logout();
    handleMenuClose();
  }

  return (
    <CssBaseline>
      <AppBar className={classes.appBar} position="sticky" color="primary">
        <Toolbar>
          {/* The header */}
          <Typography
            variant={sm ? "h4" : "body1"}
            className={classes.title}
            onClick={() => history.push("/")}
          >
            BasedChatting
          </Typography>

          {/* User menu */}
          <Popover
            open={Boolean(anchor)}
            anchorEl={anchor}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "left",
            }}
          >
            <MenuList>
              <MenuItem onClick={handleSettings}>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText primary="Settings" />
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </MenuItem>
            </MenuList>
          </Popover>

          {user ? (
            <div className={classes.authDiv}>
              {/* Display user */}
              <Typography
                noWrap
                style={{ width: "40vw" }}
                variant={sm ? "h5" : "body1"}
                align="right"
              >
                {user && user.displayName}
              </Typography>

              {/* The settings button */}
              <IconButton color="inherit" onClick={handleMenuClick}>
                {user.imageUrl ? (
                  <Avatar src={user.imageUrl} />
                ) : (
                  <AccountCircleIcon fontSize="large" />
                )}
              </IconButton>
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
