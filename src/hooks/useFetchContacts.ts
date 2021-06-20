import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { database } from "../firebase";

export type ContactType = {
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
  lastMessageDate?: Date | undefined;
  lastMessage?: {
    sender: string;
    text: string;
  };
};

export default function useFetchContacts() {
  const [contacts, setContacts] = useState<ContactType[]>([]);
  const [contact, setContact] = useState<ContactType | null>(null);

  const { user } = useAuth();
  const socket = useSocket();

  useEffect(() => {
    async function fetchContacts() {
      if (!user) return;
      const contactsRef = database.collection("contacts");
      const snapshot = await contactsRef
        .where("members", "array-contains", user.uid)
        .orderBy("lastMessageDate", "desc")
        .get();

      let contactsList: ContactType[] = [];
      snapshot.forEach(async (doc) => {
        const { name, members, createdAt, lastMessageDate, lastMessage } =
          doc.data();

        contactsList.push({
          id: doc.id,
          name,
          members,
          createdAt,
          lastMessageDate: lastMessageDate,
          lastMessage,
        });
      });
      setContacts(contactsList);
      setContact(contactsList[0]);
    }

    fetchContacts();
  }, [user]);

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

  const handleContactChangeOnMessage = useCallback(
    async (contactId: string) => {
      let contactsTmp = [...contacts];

      const doc = await database.doc(`contacts/${contactId}`).get();
      const contactToShift = doc.data();

      if (!contactToShift) return;

      contactToShift.id = doc.id;

      let index: number | null = null;
      contactsTmp.filter((contact, ind) => {
        if (contact.id === contactToShift.id) {
          index = ind;
        }
        return true;
      });
      if (!index) return;

      contactsTmp.splice(index, 1);
      contactsTmp.unshift(contactToShift as ContactType);
      setContacts(contactsTmp);
    },
    [contacts, setContacts]
  );

  return { contacts, contact, setContact, handleContactChangeOnMessage };
}
