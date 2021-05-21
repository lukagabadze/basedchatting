import React from "react";
import { Container, TextField, Typography, Button } from "@material-ui/core";
import { ReactElement } from "react";

export default function Signup(): ReactElement {
  function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <Container maxWidth="xs" style={{ marginTop: "200px" }}>
      <Typography variant="h3" align="center">
        Signup
      </Typography>
      <form onSubmit={onSubmitHandler}>
        <TextField
          variant="outlined"
          type="email"
          fullWidth
          margin="normal"
          label="Email"
          autoFocus
          required
          autoComplete="none"
        />
        <TextField
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          label="Password"
          autoFocus
          required
          autoComplete="none"
        />
        <TextField
          variant="outlined"
          type="password"
          fullWidth
          margin="normal"
          label="Repeat the password"
          autoFocus
          required
          autoComplete="none"
        />
        <Button type="submit" variant="contained" fullWidth>
          Signup
        </Button>
      </form>
    </Container>
  );
}
