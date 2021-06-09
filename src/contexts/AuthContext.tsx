import React, {
  ReactElement,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { auth, database } from "../firebase";

type AuthContextType = {
  user: UserType | null;
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
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return setUser(null);

      const snapshot = await database.collection("users").doc(user.uid).get();
      const data = snapshot.data();
      if (!data) return;

      const { uid, email, displayName } = data;
      setUser({
        uid,
        email,
        displayName,
      });
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
