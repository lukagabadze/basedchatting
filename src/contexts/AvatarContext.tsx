import React, {
  createContext,
  ReactElement,
  useContext,
  useEffect,
  useState,
} from "react";
import { database } from "../firebase";

type AvatarContextType = {
  userAvatarMap: userAvatarMapType;
  fetchAndMapUsers(members?: string[]): userAvatarMapType;
};

const defaultValue = {
  userAvatarMap: {},
  fetchAndMapUsers: () => {
    return {};
  },
};

const AvatarContext = createContext<AvatarContextType>(defaultValue);

export function useAvatar(members?: string[]) {
  const { fetchAndMapUsers } = useContext(AvatarContext);
  return fetchAndMapUsers(members);
}

interface Props {
  children: React.ReactNode;
}

export type userAvatarMapType = {
  [key: string]: string;
};

export default function AvatarProvider({ children }: Props): ReactElement {
  const [userAvatarMap, setUserAvatarMap] = useState<userAvatarMapType>({});
  let avatarUrlMap: userAvatarMapType = { ...userAvatarMap };
  let render = false;

  useEffect(() => {
    // Save mapped data to state
    setUserAvatarMap(avatarUrlMap);
  }, [render]);

  // Fetch and map all the members profile images
  function fetchAndMapUsers(members?: string[]) {
    if (!members) {
      return avatarUrlMap;
    }

    const usersRef = database.collection("users");
    members.map(async (uid) => {
      const snapshot = await usersRef.doc(uid).get();
      const data = snapshot.data();
      if (!data) return;
      if ("imageUrl" in data) {
        avatarUrlMap[uid] = data.imageUrl;
      } else {
        avatarUrlMap[uid] = "";
      }
    });

    return avatarUrlMap;
  }

  const value = {
    userAvatarMap,
    fetchAndMapUsers,
  };

  return (
    <AvatarContext.Provider value={value}>{children}</AvatarContext.Provider>
  );
}
