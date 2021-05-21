import React, {
  ReactElement,
  createContext,
  useContext,
  useState,
} from "react";

const defaultValue = {
  user: "gabo",
};

const AuthContext = createContext(defaultValue);

export function useAuth() {
  return useContext(AuthContext);
}

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props): ReactElement {
  const [user, setUser] = useState("gabo");

  const value = {
    user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
