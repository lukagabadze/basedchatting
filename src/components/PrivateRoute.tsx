import React, { ComponentType, ReactElement, ReactNode } from "react";
import { Redirect, Route } from "react-router";
import { useAuth } from "../contexts/AuthContext";

export default function PrivateRoute({
  component,
  ...rest
}: any): ReactElement {
  const { user } = useAuth();

  return (
    <Route
      {...rest}
      render={(props) => {
        return user ? (
          React.createElement(component, props)
        ) : (
          <Redirect to="/auth/login" />
        );
      }}
    />
  );
}
