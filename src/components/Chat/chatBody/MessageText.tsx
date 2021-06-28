import React, { ReactElement } from "react";
import { Paper, Typography, makeStyles } from "@material-ui/core";
import clsx from "clsx";
import { useEmoji } from "../../../contexts/EmojiContext";

const useStyles = makeStyles((theme) => ({
  messagePaper: {
    wordBreak: "break-word",
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(2),
    paddingTop: theme.spacing(1),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: "flex",
    alignItems: "center",
    maxWidth: "400px",
    minWidth: "100px",
  },
  messageOwn: {
    backgroundColor: theme.palette.secondary.main,
    color: "white",
  },
  messageOther: {
    backgroundColor: "white",
  },

  emoji: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    objectFit: "cover",
    verticalAlign: "middle",
  },
}));

interface Props {
  text: string;
  isOwn: boolean;
  sm: boolean;
}

export default function MessageText({ text, isOwn, sm }: Props): ReactElement {
  const classes = useStyles();

  const { emojis } = useEmoji();

  // Locate colon indexes
  const colons: number[] = [];
  text.split("").map((char, ind) => {
    if (char === ":") colons.push(ind);
    return null;
  });

  // check text between colon indexes for emojis
  let textJSX: Array<JSX.Element | string> = [];
  let prevInd = 0;
  for (let i = 1; i < colons.length; i += 2) {
    const textBeforeColon = text.substring(prevInd, colons[i - 1]);
    const emojiName = text.substring(colons[i - 1] + 1, colons[i]);

    textJSX.push(textBeforeColon);

    if (emojis[emojiName]) {
      textJSX.push(
        <img key={i} className={classes.emoji} src={emojis[emojiName]} alt="" />
      );
    } else {
      textJSX.push(`:${emojiName}:`);
    }

    prevInd = colons[i] + 1;
  }
  // last part of the substring
  textJSX.push(text.substring(prevInd));

  return (
    <Paper
      elevation={1}
      className={clsx(
        classes.messagePaper,
        isOwn ? classes.messageOwn : classes.messageOther
      )}
    >
      <Typography variant={sm ? "body1" : "body2"} paragraph>
        {textJSX}
      </Typography>
    </Paper>
  );
}
