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

export type UserType = {
  uid: string;
  email: string;
  displayName: string;
};

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

  async function signup(email: string, password: string) {
    const { user } = await auth.createUserWithEmailAndPassword(email, password);
    if (!user) return;

    const usersRef = database.collection("users").doc(user.uid);
    usersRef.set({
      uid: user.uid,
      email: user.email,
      displayName: user.email,
    });
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
