import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { database } from "../firebase";

type UsersMapContextType = {
  usersMap: UsersMapType;
  fetchAndMapUsers(members: string[]): void;
};

const UsersMapContext = createContext<UsersMapContextType>(
  {} as UsersMapContextType
);

export function useUsersMap() {
  return useContext(UsersMapContext);
}

interface Props {
  children: React.ReactNode;
}

export type UsersMapType = {
  [key: string]: {
    senderName: string;
    imageUrl: string;
  };
};

export default function UsersMapProvider({ children }: Props): ReactElement {
  const [usersMap, setUsersMap] = useState<UsersMapType>({});
  const usersMapRef = useRef<UsersMapType>({});

  // Fetch and map all the members profile images
  const fetchAndMapUsers = useCallback((members: string[]) => {
    const usersRef = database.collection("users");

    members.map(async (uid) => {
      if (usersMapRef.current[uid]) return;

      const snapshot = await usersRef.doc(uid).get();
      const data = snapshot.data();
      if (!data) return;

      usersMapRef.current[uid] = {
        imageUrl: data.imageUrl,
        senderName: data.displayName,
      };
    });

    setUsersMap(usersMapRef.current);
  }, []);

  const value = {
    usersMap,
    fetchAndMapUsers,
  };

  return (
    <UsersMapContext.Provider value={value}>
      {children}
    </UsersMapContext.Provider>
  );
}
