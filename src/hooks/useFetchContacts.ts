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
  seenBy: string[];
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
        const {
          name,
          members,
          createdAt,
          lastMessageDate,
          lastMessage,
          seenBy,
        } = doc.data();

        contactsList.push({
          id: doc.id,
          name,
          members,
          createdAt,
          lastMessageDate: lastMessageDate,
          lastMessage,
          seenBy: seenBy || [],
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
      setContacts([contact, ...contacts]);
    });

    return () => {
      socket.off(`new-message-${user.uid}`);
    };
  }, [socket, user, contacts, setContacts]);

  useEffect(() => {
    if (!contact) return;
    if (!user) return;
    if (contact.seenBy.includes(user.uid)) return;

    const contactRef = database.doc(`contacts/${contact.id}`);

    const newSeenBy = [...contact.seenBy, user.uid];

    contactRef.update({
      seenBy: newSeenBy,
    });

    const newContacts = contacts.map((singleContact) => {
      if (singleContact.id === contact.id) {
        return {
          ...singleContact,
          seenBy: newSeenBy,
        };
      }
      return singleContact;
    });

    setContacts(newContacts);
  }, [contact, user]);

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
      if (index === null) return;

      contactsTmp.splice(index, 1);
      contactsTmp.unshift(contactToShift as ContactType);
      setContacts(contactsTmp);

      if (contact && contactToShift.id === contact.id) {
        setContact(contactToShift as ContactType);
      }
    },
    [contacts, contact, setContacts]
  );

  return { contacts, contact, setContact, handleContactChangeOnMessage };
}
