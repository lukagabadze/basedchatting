import React from "react";
import {
  BrowserRouter,
  BrowserRouter as Router,
  Route,
} from "react-router-dom";
import AuthNav from "./AuthNav";
import Login from "./Login";
import Signup from "./Signup";

function Auth() {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gray-800">
      <div className="flex flex-col space-y-2 absolute w-2/6 top-1/4">
        <AuthNav />
        <Route path="/auth/login">
          <Login />
        </Route>
        <Route path="/auth/signup">
          <Signup />
        </Route>
      </div>
    </div>
  );
}

export default Auth;
