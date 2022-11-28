import React, {
  ReactElement,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import { auth, database } from "../firebase";
import firebase from "firebase";
import { ContactType } from "../hooks/useFetchContacts";

type AuthContextType = {
  user: UserType | null;
  signup(
    email: string,
    password: string
  ): Promise<firebase.auth.UserCredential>;
  login(email: string, password: string): Promise<firebase.auth.UserCredential>;
  logout: () => void;
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

          if (!data) {
            await saveUserInfo(user);
            return;
          }

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

  async function saveUserInfo(userToSave?: firebase.User) {
    if (!userToSave) return;

    const { uid, email } = userToSave;

    const newUser = {
      uid,
      email,
      displayName: email,
    };

    const usersRef = database.collection("users").doc(uid);
    await usersRef.set(newUser);

    // Add the user to the "All Chat" contact
    const contactRef = database.doc(
      `contacts/${process.env.REACT_APP_ALL_CHAT_ID}`
    );
    const snapshot = await contactRef.get();
    const contact: ContactType = snapshot.data() as ContactType;
    contact.members.push(uid);

    await contactRef.update({
      members: contact.members,
    });
    setUser(newUser as UserType);
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
