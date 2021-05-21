import React, {
  ReactElement,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import firebase from "firebase/app";
import { auth } from "../firebase";

type AuthContextType = {
  user: firebase.User | null;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  return useContext(AuthContext);
}

interface Props {
  children: React.ReactNode;
}

export function AuthProvider({ children }: Props): ReactElement {
  const [user, setUser] = useState<firebase.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
