import React from "react";
import { Container, TextField, Typography, Button } from "@material-ui/core";
import { ReactElement } from "react";

export default function Login(): ReactElement {
  function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
  }

  return (
    <Container maxWidth="xs" style={{ marginTop: "200px" }}>
      <Typography variant="h3" align="center">
        Login
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
        <Button type="submit" variant="contained" fullWidth>
          Login
        </Button>
      </form>
    </Container>
  );
}
