import { useState, useEffect } from "react";
import { ContactType } from "../components/Chat/contacts/Contacts";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { database } from "../firebase";

interface Props {
  setContactHandler: (contact: ContactType) => void;
}

export default function useFetchContacts({ setContactHandler }: Props) {
  const [contacts, setContacts] = useState<ContactType[]>([]);

  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    async function fetchContacts() {
      if (!user) return;
      const contactsRef = database.collection("contacts");
      const snapshot = await contactsRef
        .where("members", "array-contains", user.uid)
        .get();

      let contactsList: ContactType[] = [];
      snapshot.forEach((doc) => {
        const { name, members, createdAt } = doc.data();
        contactsList.push({
          id: doc.id,
          name,
          members,
          createdAt,
        });
        setContacts(contactsList);
        setContactHandler(contactsList[0]);
      });
    }

    fetchContacts();
  }, [user, setContactHandler]);

  useEffect(() => {
    if (!user) return;
    if (!socket) return;

    socket.on(`new-contact-${user.uid}`, (contact: ContactType) => {
      setContacts([...contacts, contact]);
    });

    return () => {
      socket.off(`new-message-${user.uid}`);
    };
  }, [socket, user, contacts, setContacts]);

  return { contacts };
}
