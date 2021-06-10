import React, { ReactElement, useState } from "react";
import { Typography, TextField, Button } from "@material-ui/core";

import { useAuth } from "../../contexts/AuthContext";
import { database } from "../../firebase";

interface Props {}

export default function ProfileSettings({}: Props): ReactElement {
  const { user } = useAuth();
  const [nameInput, setNameInput] = useState(user ? user.displayName : "");

  if (!user) return <Typography variant="h1">You must be logged in</Typography>;

  const formValid: boolean =
    nameInput && nameInput !== user.displayName ? true : false;

  function formSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!nameInput) return;
    if (!formValid) return;

    database
      .collection("users")
      .doc(user.uid)
      .update({ displayName: nameInput });
  }

  return (
    <form onSubmit={formSubmitHandler}>
      <Typography variant="h4" align="center" gutterBottom>
        Profile settings
      </Typography>

      {/* Display name */}
      <TextField
        defaultValue={user.displayName}
        label="Display name"
        variant="outlined"
        fullWidth
        margin="dense"
        value={nameInput}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNameInput(e.target.value)
        }
      />

      {/* Submit button */}
      <Button
        type="submit"
        color="primary"
        variant="contained"
        disabled={!formValid}
        style={{ margin: "auto" }}
      >
        Submit
      </Button>
    </form>
  );
}
