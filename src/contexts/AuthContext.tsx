import React, {
  ReactElement,
  createContext,
  useContext,
  useState,
} from "react";
import axios from "axios";

interface Props {
  children: React.ReactNode;
}

type ContextType = {
  user: string;
  login: (username: string, password: string) => void;
  signup: (username: string, password: string, password2: string) => void;
};

const defaultValue = {
  user: "",
  login: () => {
    return;
  },
  signup: () => {
    return;
  },
};

const AuthContext = createContext<ContextType>(defaultValue);

export function useAuth() {
  return useContext(AuthContext);
}

function AuthProvider({ children }: Props): ReactElement {
  const [user, setUser] = useState("");

  function login(username: string, password: string) {
    const body = { username, password };
    axios
      .post("http://localhost:4000/auth/login", body)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function signup(username: string, password: string, password2: string) {
    const body = { username, password };
    axios
      .post("http://localhost:4000/auth/signup", body)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  const value = {
    user,
    login,
    signup,
  };

  console.log(user);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
