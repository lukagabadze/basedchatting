import { ReactElement } from "react";
import { Typography, makeStyles, Paper, Box, Avatar } from "@material-ui/core";
import { MessageType } from "../../../hooks/useFetchMessage";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  messageDiv: {
    display: "flex",
    margin: theme.spacing(1),
  },
  messagePaper: {
    wordBreak: "break-word",
    padding: theme.spacing(1),
    marginLeft: 3,
    marginRight: 3,
    display: "flex",
    flexDirection: "row",
    maxWidth: "400px",
    minWidth: "100px",
  },

  messageOther: {
    backgroundColor: "white",
  },
  messageOwn: {
    backgroundColor: "#6969FF",
    color: "white",
  },
}));

interface Props {
  message: MessageType;
  isOwn: boolean;
  userImageUrl: string;
}

export default function Message({
  message,
  isOwn,
  userImageUrl,
}: Props): ReactElement {
  const classes = useStyles();

  return (
    <Box
      className={classes.messageDiv}
      style={
        isOwn ? { flexDirection: "row-reverse" } : { flexDirection: "row" }
      }
    >
      {userImageUrl && <Avatar src={userImageUrl} />}
      <Paper
        elevation={3}
        className={clsx(
          classes.messagePaper,
          isOwn ? classes.messageOwn : classes.messageOther
        )}
      >
        <Typography gutterBottom paragraph>
          {message.text}
        </Typography>
      </Paper>

      <div style={{ flexGrow: 1, display: !isOwn ? "block" : "none" }}></div>
    </Box>
  );
}
