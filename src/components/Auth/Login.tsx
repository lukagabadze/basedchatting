import React from "react";
import AuthCard from "./components/AuthCard";
import AuthError from "./components/AuthError";
import AuthInput from "./components/AuthInput";
import AuthSubmit from "./components/AuthSubmit";

function Login() {
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
      </div>
      <AuthSubmit />
    </AuthCard>
  );
}

export default Login;
