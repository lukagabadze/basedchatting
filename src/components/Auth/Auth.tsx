import React from "react";
import {
  BrowserRouter,
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import Login from "./Login";
import Signup from "./Signup";

function Auth() {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-800">
      <Route path="/auth/login">
        <Login />
      </Route>
      <Route path="/auth/signup">
        <Signup />
      </Route>
    </div>
  );
}

export default Auth;
