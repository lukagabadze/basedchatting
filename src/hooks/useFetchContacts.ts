import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSocket } from "../contexts/SocketContext";
import { database } from "../firebase";

export type ContactType = {
  id: string;
  name: string;
  members: string[];
  createdAt: Date;
  lastMessageDate: Date | undefined;
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
        const { name, members, createdAt, lastMessageDate } = doc.data();

        contactsList.push({
          id: doc.id,
          name,
          members,
          createdAt,
          lastMessageDate: lastMessageDate,
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
    (contactId: string) => {
      const contactsTmp = [...contacts];

      let contactToShift: ContactType | null = null;
      contactsTmp.map((contact) => {
        if (contact.id === contactId) {
          contactToShift = contact;
        }
        return contact;
      });

      if (!contactToShift) return;

      contactsTmp.splice(contacts.indexOf(contactToShift), 1);
      contactsTmp.unshift(contactToShift);

      setContacts(contactsTmp);
    },
    [contacts, setContacts]
  );

  return { contacts, contact, setContact, handleContactChangeOnMessage };
}
