import React, { useState } from "react";
import AuthCard from "./components/AuthCard";
import AuthError from "./components/AuthError";
import AuthInput from "./components/AuthInput";
import AuthSubmit from "./components/AuthSubmit";

const initialForm = {
  username: "",
  password: "",
};

function Login() {
  const [form, setForm] = useState(initialForm);

  return (
    <form>
      <AuthCard>
        <div className="flex flex-col space-y-2 mx-5 my-3">
          <AuthInput
            label="Username"
            id="username"
            type="text"
            placeholder="Username..."
            value={form.username}
            onChangeHandler={(e: React.FormEvent<HTMLInputElement>) =>
              setForm({ ...form, username: e.currentTarget.value })
            }
          />
          <AuthError error="" />

          <AuthInput
            label="Password"
            id="password"
            type="password"
            placeholder="Password..."
            value={form.password}
            onChangeHandler={(e: React.FormEvent<HTMLInputElement>) =>
              setForm({ ...form, password: e.currentTarget.value })
            }
          />
          <AuthError error="" />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
          }}
        ></button>
        <AuthSubmit />
      </AuthCard>
    </form>
  );
}

export default Login;
