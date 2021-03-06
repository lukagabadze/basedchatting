import {
  createContext,
  ReactElement,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { storage } from "../firebase";
import { useSocket } from "./SocketContext";

type emojiContextType = {
  emojis: EmojiType;
  addCustomEmoji({ emojiName, contactId, image }: CustomEmojiFn): void;
};

const emojiContext = createContext({} as emojiContextType);
export function useEmoji() {
  return useContext(emojiContext);
}

interface CustomEmojiFn {
  emojiName: string;
  contactId: string;
  image: File;
}
interface EmojiUpdateFn {
  emojiName: string;
  url: string;
}

export type EmojiType = {
  [key: string]: string;
};

interface Props {
  children: ReactNode;
}

export default function EmojiProvider({ children }: Props): ReactElement {
  const [emojis, setEmojis] = useState<EmojiType>({});

  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    socket.on("emoji-update", (emoji: EmojiUpdateFn) => {
      const emojisTmp = emojis;
      emojis[emoji.emojiName] = emoji.url;
      setEmojis(emojisTmp);
    });
  });

  useEffect(() => {
    async function fetchEmojis() {
      let emojisMap: EmojiType = {};
      const test = await storage.ref("custom-emojis").listAll();
      test.items.forEach(async (item) => {
        const url = await item.getDownloadURL();
        const emojiName = item.name.substring(item.name.indexOf("-") + 1);
        emojisMap[emojiName] = url;
      });

      setEmojis(emojisMap);
    }
    fetchEmojis();
  }, []);

  async function addCustomEmoji({
    emojiName,
    contactId,
    image,
  }: CustomEmojiFn) {
    const fileName = `${contactId}-${emojiName}`;
    const storageRef = storage.ref(`custom-emojis/${fileName}`);
    await storageRef.put(image);
    const url = await storageRef.getDownloadURL();

    const emojisCopy = { ...emojis };
    emojisCopy[emojiName] = url;
    setEmojis(emojisCopy);

    if (socket) {
      socket.emit("emoji-update", { emojiName, url });
    }
  }

  const value = {
    emojis,
    addCustomEmoji,
  };

  return (
    <emojiContext.Provider value={value}>{children}</emojiContext.Provider>
  );
}
