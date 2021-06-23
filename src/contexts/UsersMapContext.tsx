import React, {
  createContext,
  ReactElement,
  useCallback,
  useContext,
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

  // Fetch and map all the members profile images
  const fetchAndMapUsers = useCallback((members: string[]) => {
    const usersRef = database.collection("users");

    const usersMapTmp = { ...usersMap };
    members.map(async (uid) => {
      const snapshot = await usersRef.doc(uid).get();

      const data = snapshot.data();
      if (!data) return;

      usersMapTmp[uid] = {
        imageUrl: data.imageUrl,
        senderName: data.displayName,
      };
    });

    if (usersMapTmp !== usersMap) setUsersMap(usersMapTmp);
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
