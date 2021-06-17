import React, {
  createContext,
  ReactElement,
  useContext,
  useRef,
  useState,
} from "react";
import { database } from "../firebase";

type AvatarContextType = {
  userAvatarMap: userAvatarMapType;
  fetchAndMapUsers(members: string[]): void;
};

const AvatarContext = createContext<AvatarContextType>({} as AvatarContextType);

export function useAvatar() {
  return useContext(AvatarContext);
}

interface Props {
  children: React.ReactNode;
}

export type userAvatarMapType = {
  [key: string]: string;
};

export default function AvatarProvider({ children }: Props): ReactElement {
  const [userAvatarMap, setUserAvatarMap] = useState<userAvatarMapType>({});
  const avatarUrlMap = useRef<userAvatarMapType>({});

  // Fetch and map all the members profile images
  const fetchAndMapUsers = (members: string[]) => {
    const usersRef = database.collection("users");
    members.map(async (uid) => {
      const snapshot = await usersRef.doc(uid).get();
      const data = snapshot.data();
      if (!data) return;
      if ("imageUrl" in data) {
        avatarUrlMap.current[uid] = data.imageUrl;
      } else {
        avatarUrlMap.current[uid] = "";
      }
    });
    setUserAvatarMap(avatarUrlMap.current);
  };

  const value = {
    userAvatarMap,
    fetchAndMapUsers,
  };

  return (
    <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
  );
}
