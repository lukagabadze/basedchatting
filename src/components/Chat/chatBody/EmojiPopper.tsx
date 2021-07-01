import { ReactElement, useState } from "react";
import {
  IconButton,
  Popper,
  Typography,
  makeStyles,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  CircularProgress,
} from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { useEmoji } from "../../../contexts/EmojiContext";

const useStyles = makeStyles((theme) => ({
  popperDiv: {
    position: "absolute",
    top: "-250px",
    left: "-200px",
    zIndex: 10,
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(1),
    border: "3px solid white",
    color: "white",
    maxHeight: "300px",
    width: "250px",
    overflowY: "scroll",
    wordBreaK: "break-word",
    userSelect: "none",
  },
  popperHeader: {
    display: "flex",
    justifyContent: "space-between",
  },

  dialogContent: {
    display: "flex",
    flexDirection: "column",
  },

  uploadLabel: {
    marginLeft: theme.spacing(3),
    display: "flex",
    alignItems: "center",
  },
  imageName: {
    marginLeft: theme.spacing(1),
  },

  emoji: {
    width: theme.spacing(5),
    height: theme.spacing(5),
    objectFit: "cover",
    margin: "1px",
    cursor: "pointer",
  },
}));

interface EmojiForm {
  emojiName: string;
  image: File | undefined;
}
const defaultEmojiForm = {
  emojiName: "",
  image: undefined,
};

interface Props {
  anchorEl: HTMLButtonElement | null;
  contactId: string;
  emojiClickHandler: (imageName: string) => void;
}

export default function EmojiPopper({
  anchorEl,
  contactId,
  emojiClickHandler,
}: Props): ReactElement {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<EmojiForm>(defaultEmojiForm);
  const [loading, setLoading] = useState<boolean>(false);

  const { emojis, addCustomEmoji } = useEmoji();
  const classes = useStyles();

  function inputTextChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, emojiName: e.target.value });
  }
  function inputFileChangeHandler(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, image: e.target.files![0] });
  }

  async function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!form.image) return;
    if (!form.emojiName) return;
    setLoading(true);

    await addCustomEmoji({
      emojiName: form.emojiName,
      image: form.image,
      contactId,
    });

    setLoading(false);
    setForm(defaultEmojiForm);
    setOpen(false);
  }

  return (
    <>
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top">
        <div className={classes.popperDiv}>
          <div className={classes.popperHeader}>
            <Typography variant="h6">Emojis</Typography>
            <IconButton
              color="inherit"
              size="small"
              onClick={() => setOpen(true)}
            >
              <AddCircleOutlineIcon />
            </IconButton>
          </div>
          {Object.keys(emojis).map((emojiName) => {
            return (
              <img
                className={classes.emoji}
                src={emojis[emojiName]}
                alt=""
                key={emojiName}
                onClick={() => emojiClickHandler(`:${emojiName}:`)}
              />
            );
          })}
        </div>
      </Popper>

      {/* Add emoji dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Custom emoji</DialogTitle>
        <form onSubmit={formSubmitHandler}>
          <DialogContent className={classes.dialogContent}>
            <TextField
              value={form.emojiName}
              onChange={inputTextChangeHandler}
              label="Emoji name"
              margin="dense"
              autoFocus
              fullWidth
            />
            <input
              onChange={inputFileChangeHandler}
              type="file"
              id="emoji-image-input"
              accept="image/*"
              style={{ display: "none" }}
            />
          </DialogContent>
          <label className={classes.uploadLabel} htmlFor="emoji-image-input">
            <Button variant="contained" color="primary" component="span">
              Upload
            </Button>
            <Typography className={classes.imageName}>
              {form.image ? form.image.name : "Image not uploaded!"}
            </Typography>
          </label>

          <DialogActions>
            <Button color="primary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={Boolean(!form.image || !form.emojiName)}
              type="submit"
            >
              {loading ? <CircularProgress color="inherit" /> : "Submit"}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
