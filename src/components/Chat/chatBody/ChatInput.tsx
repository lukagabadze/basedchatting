import React, {
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Badge, IconButton, makeStyles, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import ImageIcon from "@material-ui/icons/Image";
import CancelIcon from "@material-ui/icons/Cancel";
import MoodIcon from "@material-ui/icons/Mood";
import { useAuth } from "../../../contexts/AuthContext";
import { useSocket } from "../../../contexts/SocketContext";
import { ContactType } from "../../../hooks/useFetchContacts";
import { storage } from "../../../firebase";
import EmojiPopper from "./EmojiPopper";

const useStyles = makeStyles((theme) => ({
  inputWrapper: {
    display: "flex",
    alignItems: "end",
    position: "relative",
  },
  chatInputDiv: {
    width: "100%",
  },
  chatInput: {
    backgroundColor: "white",
  },
  inputImageDiv: {
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(2),
    marginRight: theme.spacing(2),
  },

  fileInput: {
    display: "none",
  },
  inputImage: {
    maxWidth: theme.spacing(10),
    maxHeight: theme.spacing(10),
    border: "3px solid black",
  },
  imageCancelBadge: {
    zIndex: 0,
  },
  cancelIcon: {
    backgroundColor: "black",
    borderRadius: "100%",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "red",
    },
  },

  iconButtonDiv: {
    display: "flex",
  },

  emoji: {
    cursor: "pointer",
    margin: theme.spacing(1),
  },
}));

interface Props {
  contact: ContactType;
}

interface ImageInputType {
  file: File;
  imageUrl: string;
}

export default function ChatInput({ contact }: Props): ReactElement {
  const [input, setInput] = useState<string>("");
  const [imageInput, setImageInput] = useState<ImageInputType | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
  const isTypingRef = useRef<boolean>(false);

  const classes = useStyles();
  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;
    if (!user) return;
    if (isTypingRef.current === Boolean(input)) return;

    isTypingRef.current = Boolean(input);

    socket.emit("is-typing", {
      contactId: contact.id,
      userUid: user.uid,
      isTyping: Boolean(input),
    });
  }, [input, contact, socket, user]);

  const chatFormSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!contact) return;
    if (!input) return;
    if (!socket) return;

    const text = input;
    setInput("");

    const file = imageInput?.file;
    setImageInput(null);
    setAnchorEl(null);

    if (!text && !file) return;

    const newMessage = {
      sender: user.uid,
      contactId: contact.id,
      createdAt: Date.now(),
      members: contact.members,
    };

    if (text) {
      socket.emit("new-message", { ...newMessage, text });
    }
    if (file) {
      const fileName = `${contact.id}-${user.uid}-${Date.now()}`;
      const storageRef = storage.ref(`message-images/${fileName}`);
      await storageRef.put(file);
      const url = await storageRef.getDownloadURL();

      socket.emit("new-message", { ...newMessage, imageUrl: url });
    }
  };

  const handleFileInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (!files) return;

      const file = files[0];

      const newImageInput: ImageInputType = {
        file: file,
        imageUrl: URL.createObjectURL(file),
      };

      setImageInput(newImageInput);
    },
    []
  );

  const onImageCloseHandler = useCallback(() => {
    setImageInput(null);
  }, []);

  // Emoji handler
  const handlePopperToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(anchorEl ? null : e.currentTarget);
  };

  const emojiClickHandler = (emojiName: string) => {
    setInput(`${input} ${emojiName} `);
  };

  return (
    <form className={classes.inputWrapper} onSubmit={chatFormSubmitHandler}>
      <input
        accept="image/*"
        className={classes.fileInput}
        id="image-input"
        type="file"
        onChange={handleFileInputChange}
      />
      <label htmlFor="image-input">
        <IconButton color="secondary" component="span">
          <ImageIcon />
        </IconButton>
      </label>
      <div className={classes.chatInputDiv}>
        <TextField
          value={input}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          variant="outlined"
          fullWidth
          autoFocus
          margin="dense"
          color="secondary"
          rows={4}
          InputProps={{
            className: classes.chatInput,
            startAdornment: (
              <>
                {imageInput && (
                  <div className={classes.inputImageDiv}>
                    <Badge
                      className={classes.imageCancelBadge}
                      badgeContent={
                        <CancelIcon
                          className={classes.cancelIcon}
                          color="secondary"
                          onClick={onImageCloseHandler}
                        />
                      }
                    >
                      <img
                        className={classes.inputImage}
                        src={imageInput.imageUrl}
                        alt=""
                      />
                    </Badge>
                  </div>
                )}
              </>
            ),
          }}
        />
      </div>

      <div className={classes.iconButtonDiv}>
        <IconButton onClick={handlePopperToggle}>
          <MoodIcon color="secondary" />
        </IconButton>
        <IconButton color="secondary" type="submit">
          <SendIcon />
        </IconButton>
      </div>

      {/* Emoji Popper */}
      <EmojiPopper
        anchorEl={anchorEl}
        contactId={contact.id}
        emojiClickHandler={emojiClickHandler}
      />
    </form>
  );
}
