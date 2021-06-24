import React, { ReactElement, useCallback, useRef, useState } from "react";
import { Badge, IconButton, makeStyles, TextField } from "@material-ui/core";
import SendIcon from "@material-ui/icons/Send";
import ImageIcon from "@material-ui/icons/Image";
import CancelIcon from "@material-ui/icons/Cancel";
import { useAuth } from "../../../contexts/AuthContext";
import { useSocket } from "../../../contexts/SocketContext";
import { ContactType } from "../../../hooks/useFetchContacts";
import { storage } from "../../../firebase";

const useStyles = makeStyles((theme) => ({
  inputWrapper: {
    display: "flex",
    alignItems: "center",
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
  cancelIcon: {
    backgroundColor: "black",
    borderRadius: "100%",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "red",
    },
  },
  inputImage: {
    maxWidth: theme.spacing(20),
    maxHeight: theme.spacing(20),
  },
  fileInput: {
    display: "none",
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [imageInput, setImageInput] = useState<ImageInputType | null>(null);

  const classes = useStyles();
  const { user } = useAuth();
  const socket = useSocket();

  const chatFormSubmitHandler = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!contact) return;
    if (!inputRef.current) return;
    if (!socket) return;

    const text = inputRef.current.value;
    inputRef.current.value = "";

    const file = imageInput?.file;
    setImageInput(null);

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
          inputRef={inputRef}
          variant="outlined"
          fullWidth
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

      <div>
        <IconButton color="secondary" type="submit">
          <SendIcon />
        </IconButton>
      </div>
    </form>
  );
}
