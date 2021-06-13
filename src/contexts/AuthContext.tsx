import React, {
  ReactElement,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { auth, database } from "../firebase";
import firebase from "firebase";

type AuthContextType = {
  user: UserType | null;
  signup(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential>;
  login(email: string, password: string): Promise<firebase.auth.UserCredential>;
  logout: () => void;
  saveUserInfo: () => void;
};

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

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
  imageUrl: string | null;
};

export function AuthProvider({ children }: Props): ReactElement {
  const [user, setUser] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return setUser(null);

      database
        .collection("users")
        .doc(user.uid)
        .onSnapshot(async (snapshot) => {
          const data = snapshot.data();
          if (!data) return;

          const { uid, email, displayName, imageUrl } = data;

          setUser({
            uid,
            email,
            displayName,
            imageUrl,
          });
        });
    });
    setLoading(false);

    return unsubscribe;
  }, []);

  async function signup(email: string, password: string) {
    return auth.createUserWithEmailAndPassword(email, password);
  }

  function login(email: string, password: string) {
    return auth.signInWithEmailAndPassword(email, password);
  }

  function logout() {
    return auth.signOut();
  }

  function saveUserInfo() {
    if (!user) return;

    const usersRef = database.collection("users").doc(user.uid);
    usersRef.set({
      uid: user.uid,
      email: user.email,
      displayName: user.email,
    });
  }

  const value = {
    user,
    signup,
    login,
    logout,
    saveUserInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
