import React, {
  ReactElement,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import firebase from "firebase/app";
import { auth, database } from "../firebase";

type AuthContextType = {
  user: firebase.User | null;
  signup(email: string, password: string): void;
  login(email: string, password: string): void;
  logout: () => void;
};
const defaultValue = {
  user: null,
  signup: () => {},
  login: () => {},
  logout: () => {},
};

const AuthContext = createContext<AuthContextType>(defaultValue);

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
      if (user) {
        const usersRef = database.ref(`users/`);
        usersRef.once("value").then((snapshot) => {
          if (!snapshot.child(user.uid).exists()) {
            database.ref(`/users/${user.uid}`).set({
              displayName: user.email,
            });
          }
        });
      }
    });

    return unsubscribe;
  }, []);

  function signup(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  const value = {
    user,
    signup,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
