import React, { useState, ReactElement } from "react";
import {
  Container,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { useAuth } from "../../contexts/AuthContext";
import { Link } from "react-router-dom";

const initialForm = {
  email: "",
  password: "",
};

export default function Login(): ReactElement {
  const { login } = useAuth();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmitHandler(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    const { email, password } = form;
    try {
      setLoading(true);
      await login(email, password);
      setForm(initialForm);
    } catch (err) {
      setError("Failed to login!");
    }
    setLoading(false);
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
        <Typography color="secondary" align="center">
          {error}
        </Typography>
        <Button color="primary" type="submit" variant="contained" fullWidth>
          {loading ? <CircularProgress color="inherit" /> : "Login"}
        </Button>
        <Typography style={{ marginTop: "10px" }}>
          Don't have an account? <Link to="/auth/signup">Signup</Link>
        </Typography>
      </form>
    </Container>
  );
}
