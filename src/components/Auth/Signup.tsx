import React, { ReactElement } from "react";
import AuthCard from "./components/AuthCard";
import AuthError from "./components/AuthError";
import AuthInput from "./components/AuthInput";
import AuthSubmit from "./components/AuthSubmit";

interface Props {}

function Signup({}: Props): ReactElement {
  return (
    <AuthCard>
      <div className="flex flex-col space-y-2 mx-5 my-3">
        <AuthInput
          label="Username"
          id="username"
          type="text"
          placeholder="Username..."
        />
        <AuthError error="" />

        <AuthInput
          label="Password"
          id="password"
          type="password"
          placeholder="Password..."
        />
        <AuthError error="" />

        <AuthInput
          label="Repeat password"
          id="password2"
          type="password"
          placeholder="Repeat password..."
        />
        <AuthError error="" />
      </div>
      <AuthSubmit />
    </AuthCard>
  );
}

export default Signup;
