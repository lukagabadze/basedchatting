import { ReactElement } from "react";
import { Typography, makeStyles, Paper, Box } from "@material-ui/core";
import clsx from "clsx";

export type MessageType = {
  id: string;
  text: string;
  sender: string;
  contactId: string;
  createdAt: Date;
};

const useStyles = makeStyles({
  messageDiv: {
    display: "flex",
    flexDirection: "row",
  },
  messagePaper: {
    wordBreak: "break-word",
    padding: 3,
    margin: 5,
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
});

interface Props {
  message: MessageType;
  isOwn: boolean;
}

export default function Message({ message, isOwn }: Props): ReactElement {
  const classes = useStyles();

  return (
    <Box className={classes.messageDiv} style={{ flexDirection: "revert" }}>
      <div style={{ flexGrow: 1, display: isOwn ? "block" : "none" }}></div>

      <Paper
        elevation={3}
        className={clsx(
          classes.messagePaper,
          isOwn ? classes.messageOwn : classes.messageOther
        )}
      >
        <Typography
          // align={isOwn ? "right" : "left"}
          gutterBottom
          paragraph
        >
          {message.text}
        </Typography>
      </Paper>

      <div style={{ flexGrow: 1, display: !isOwn ? "block" : "none" }}></div>
    </Box>
  );
}
