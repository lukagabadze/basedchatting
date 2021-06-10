import React, { ReactElement, useState } from "react";
import { Typography, TextField, Button, makeStyles } from "@material-ui/core";
import { useAuth } from "../../contexts/AuthContext";
import { database, storage } from "../../firebase";

const useStyles = makeStyles((theme) => ({
  textInput: {
    marginRight: theme.spacing(2),
  },
  fileInputDiv: {
    marginTop: theme.spacing(3),
  },
  fileInput: {
    display: "none",
  },
  imagePreview: {
    maxWidth: "250px",
    maxHeight: "500px",
    objectFit: "contain",
    marginTop: theme.spacing(1),
  },
  submitButton: {
    marginTop: theme.spacing(3),
    textTransform: "none",
  },
}));

export default function ProfileSettings(): ReactElement {
  const { user } = useAuth();
  const classes = useStyles();

  const [nameInput, setNameInput] = useState(user ? user.displayName : "");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    user ? user.imageUrl : null
  );
  const [loading, setLoading] = useState<boolean>(false);

  if (!user) return <Typography variant="h1">You must be logged in</Typography>;

  const formValid: boolean =
    (nameInput && nameInput !== user.displayName) || image ? true : false;

  async function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!formValid) return;

    setLoading(true);

    let updatedUser = {
      displayName: nameInput,
      imageUrl: user.imageUrl,
    };

    if (image) {
      const fileName = `${user.uid}-${image.name}`;
      const storageRef = storage.ref(`profile-images/${fileName}`);
      await storageRef.put(image);
      const url = await storageRef.getDownloadURL();
      updatedUser.imageUrl = url;
    }

    await database.collection("users").doc(user.uid).update(updatedUser);

    setLoading(false);
    setImage(null);
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <Typography variant="h4" align="center" gutterBottom>
        Profile settings
      </Typography>

      {/* Display name */}
      <TextField
        className={classes.textInput}
        label="Display name"
        variant="outlined"
        fullWidth
        margin="dense"
        value={nameInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNameInput(e.target.value)
        }
      />

      <div className={classes.fileInputDiv}>
        <Typography variant="h5" display="inline">
          Profile image:{" "}
        </Typography>
        <label htmlFor="profile-image-upload">
          <Button variant="contained" color="primary" component="span">
            Upload
          </Button>
        </label>
        <input
          className={classes.fileInput}
          type="file"
          accept="image/*"
          id="profile-image-upload"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files) return;

            setImage(files[0]);
            setImagePreview(URL.createObjectURL(files[0]));
          }}
        />
        {imagePreview && (
          <>
            <br />
            <img className={classes.imagePreview} src={imagePreview} />
          </>
        )}
      </div>

      {/* Submit button */}
      <Button
        className={classes.submitButton}
        disableElevation
        type="submit"
        color="secondary"
        variant="contained"
        disabled={!formValid}
        fullWidth
      >
        {loading ? "Loading..." : "Save"}
      </Button>
    </form>
  );
}
