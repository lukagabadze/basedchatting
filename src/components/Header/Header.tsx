import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { ReactElement } from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  title: {
    flexGrow: 1,
  },
  buttonsDiv: {
    flex: "none",
  },
  button: {
    margin: "10px",
  },
});

export default function Header(): ReactElement {
  const classes = useStyles();

  return (
    <div>
      <AppBar position="fixed" color="primary">
        <Toolbar>
          <Typography variant="h4" className={classes.title}>
            BasedChatting
          </Typography>
          <div className={classes.buttonsDiv}>
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
        </Toolbar>
      </AppBar>
    </div>
  );
}
