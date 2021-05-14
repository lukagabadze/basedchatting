import React, { ReactElement, useState } from "react";
import AuthCard from "./components/AuthCard";
import AuthError from "./components/AuthError";
import AuthInput from "./components/AuthInput";
import AuthSubmit from "./components/AuthSubmit";

interface Props {}

const initialForm = {
  username: "",
  password: "",
  password2: "",
};

function Signup({}: Props): ReactElement {
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

          <AuthInput
            label="Repeat password"
            id="password2"
            type="password"
            placeholder="Repeat password..."
            value={form.password2}
            onChangeHandler={(e: React.FormEvent<HTMLInputElement>) =>
              setForm({ ...form, password2: e.currentTarget.value })
            }
          />
          <AuthError error="" />
        </div>
        <AuthSubmit />
      </AuthCard>
    </form>
  );
}

export default Signup;
