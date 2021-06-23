import { ReactElement } from "react";
import { Typography, makeStyles, Paper, Box, Avatar } from "@material-ui/core";
import { MessageType } from "../../../hooks/useFetchMessage";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  messageDiv: {
    display: "flex",
    margin: theme.spacing(1),
  },
  userAvatar: {
    marginTop: theme.spacing(3),
  },
  userNameOwn: {
    marginRight: theme.spacing(1),
  },
  userNameOther: {
    marginLeft: theme.spacing(1),
  },
  messagePaper: {
    wordBreak: "break-word",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    marginLeft: 3,
    marginRight: 3,
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    minWidth: "100px",
  },

  messageOther: {
    backgroundColor: "white",
  },
  messageOwn: {
    backgroundColor: theme.palette.secondary.light,
    color: "white",
  },
}));

interface Props {
  message: MessageType;
  isOwn: boolean;
  userImageUrl?: string;
  userName?: string;
}

export default function Message({
  message,
  isOwn,
  userImageUrl,
  userName,
}: Props): ReactElement {
  const classes = useStyles();

  return (
    <Box
      className={classes.messageDiv}
      style={
        isOwn ? { flexDirection: "row-reverse" } : { flexDirection: "row" }
      }
    >
      {userImageUrl && (
        <Avatar className={classes.userAvatar} src={userImageUrl} />
      )}
      <div
      // style={{ backgroundColor: "red" }}
      >
        <Typography
          align={isOwn ? "right" : "left"}
          variant="subtitle2"
          color="textPrimary"
          className={clsx(isOwn ? classes.userNameOwn : classes.userNameOther)}
        >
          {userName}
        </Typography>
        <Paper
          elevation={3}
          className={clsx(
            classes.messagePaper,
            isOwn ? classes.messageOwn : classes.messageOther
          )}
        >
          <Typography paragraph>{message.text}</Typography>
        </Paper>
      </div>

      <div style={{ flexGrow: 1, display: !isOwn ? "block" : "none" }}></div>
    </Box>
  );
}
