import React, { useState } from "react";
import { Container, TextField, Typography, Button } from "@material-ui/core";
import { ReactElement } from "react";
import { useAuth } from "../../contexts/AuthContext";

const initialForm = {
  email: "",
  password: "",
  passwordRepeat: "",
};

export default function Signup(): ReactElement {
  const { user, signup } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");

  async function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { email, password, passwordRepeat } = form;
    if (password !== passwordRepeat) {
      return setError("Passwords must match!");
    }
    try {
      await signup(email, password);
    } catch {
      setError("Failed to sign up");
    }
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
          value={form.email}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setForm({ ...form, email: e.target.value });
          }}
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
          value={form.password}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setForm({ ...form, password: e.target.value });
          }}
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
          value={form.passwordRepeat}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            setForm({ ...form, passwordRepeat: e.target.value });
          }}
        />
        <Typography color="secondary" align="center">
          {error}
        </Typography>
        <Button type="submit" variant="contained" fullWidth>
          Signup
        </Button>
      </form>
    </Container>
  );
}
