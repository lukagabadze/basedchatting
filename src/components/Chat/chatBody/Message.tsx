import { ReactElement, useCallback, useState } from "react";
import {
  Typography,
  makeStyles,
  Box,
  Avatar,
  Dialog,
  DialogContent,
  useTheme,
  useMediaQuery,
} from "@material-ui/core";
import { MessageType } from "../../../hooks/useFetchMessage";
import moment from "moment";
import MessageText from "./MessageText";

const useStyles = makeStyles((theme) => ({
  messageDiv: {
    display: "flex",
    marginBottom: theme.spacing(1),
    // maxWidth: "200px",
  },
  messageContentDiv: {
    display: "flex",
    flexDirection: "column",
  },

  userAvatar: {
    marginTop: theme.spacing(3),
  },
  userName: {
    marginRight: theme.spacing(2),
    maxWidth: "150px",
  },

  messageHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    paddingLeft: theme.spacing(1),
  },

  messageDate: {
    paddingRight: theme.spacing(1),
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

  messageSentFromNowDate: {
    marginLeft: theme.spacing(1),
  },

  dialogImage: {
    maxWidth: "80vw",
    maxHeight: "80vh",
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

  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.up("sm"));

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
      {/* User image */}
      <Avatar className={classes.userAvatar} src={userImageUrl} />

      <div className={classes.messageContentDiv}>
        <div className={classes.messageHeader}>
          {/* Username */}
          <Typography
            align={isOwn ? "right" : "left"}
            variant="subtitle2"
            color="textPrimary"
            className={classes.userName}
            noWrap
          >
            {userName}
          </Typography>

          {/* Message Date */}
          <Typography variant="subtitle2" className={classes.messageDate}>
            {moment(message.createdAt).format("hh:mm")}
          </Typography>
        </div>

        {/* Message text content */}
        {message.text && (
          <MessageText text={message.text} isOwn={isOwn} sm={sm} />
        )}
        {/* Message image content */}
        {message.imageUrl && (
          <img
            className={classes.messageImage}
            src={message.imageUrl}
            alt=""
            onClick={() => imageOnClickHandler(message.imageUrl!)}
          />
        )}
        {/* Message sent from now */}
        <Typography
          className={classes.messageSentFromNowDate}
          variant="subtitle2"
        >
          {moment(message.createdAt).fromNow()}
        </Typography>
      </div>

      {/* Image view dialog */}
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
