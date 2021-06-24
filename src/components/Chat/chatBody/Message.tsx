import { ReactElement, useCallback, useState } from "react";
import {
  Typography,
  makeStyles,
  Paper,
  Box,
  Avatar,
  Dialog,
  DialogContent,
} from "@material-ui/core";
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
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    display: "flex",
    flexDirection: "column",
    maxWidth: "400px",
    minWidth: "100px",
  },

  messageImage: {
    maxWidth: theme.spacing(25),
    maxHeight: theme.spacing(25),
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    border: "3px solid",
    borderColor: theme.palette.secondary.dark,
    cursor: "pointer",
    "&:hover": {
      opacity: "60%",
    },
  },

  dialogImage: {
    maxWidth: "80vw",
    maxHeight: "80vh",
  },

  messageOther: {
    backgroundColor: "white",
  },
  messageOwn: {
    backgroundColor: theme.palette.secondary.main,
    color: "white",
  },
}));

interface imageModalType {
  open: boolean;
  imageUrl?: string;
}

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
  const [imageModal, setImageModal] = useState<imageModalType>({ open: false });
  const classes = useStyles();

  const imageOnClickHandler = useCallback((imageUrl: string) => {
    setImageModal({ open: true, imageUrl: imageUrl });
  }, []);

  const modalOnCloseHandler = useCallback(() => {
    setImageModal({ open: false, imageUrl: undefined });
  }, []);

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
      <div>
        <Typography
          align={isOwn ? "right" : "left"}
          variant="subtitle2"
          color="textPrimary"
          className={clsx(isOwn ? classes.userNameOwn : classes.userNameOther)}
        >
          {userName}
        </Typography>
        {message.text && (
          <Paper
            elevation={3}
            className={clsx(
              classes.messagePaper,
              isOwn ? classes.messageOwn : classes.messageOther
            )}
          >
            <Typography paragraph>{message.text}</Typography>
          </Paper>
        )}
        {message.imageUrl && (
          <img
            className={classes.messageImage}
            src={message.imageUrl}
            alt=""
            onClick={() => imageOnClickHandler(message.imageUrl!)}
          />
        )}
      </div>

      <Dialog
        maxWidth={"lg"}
        open={imageModal.open}
        onClose={modalOnCloseHandler}
      >
        {imageModal.imageUrl && (
          <DialogContent>
            <img
              className={classes.dialogImage}
              src={imageModal.imageUrl}
              alt=""
            />
          </DialogContent>
        )}
      </Dialog>
    </Box>
  );
}
