import React, { useState } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { ReactElement } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const initialForm = {
  email: "",
  password: "",
  passwordRepeat: "",
};

export default function Signup(): ReactElement {
  const { signup } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { email, password, passwordRepeat } = form;
    if (password !== passwordRepeat) {
      return setError("Passwords must match!");
    }
    try {
      setLoading(true);
      await signup(email, password);
      setForm(initialForm);
    } catch {
      setError("Failed to sign up");
    }

    setLoading(false);
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
        <Button color="primary" type="submit" variant="contained" fullWidth>
          {loading ? <CircularProgress color="inherit" /> : "Signup"}
        </Button>
        <Typography style={{ marginTop: "10px" }}>
          Already have an account? <Link to="/auth/login">Login</Link>
        </Typography>
      </form>
    </Container>
  );
}
