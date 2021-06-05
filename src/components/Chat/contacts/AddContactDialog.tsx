import { ReactElement, useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";
import { database } from "../../../firebase";

interface Props {
  open: boolean;
  handleToggle: () => void;
}

export type User = {
  uid: string;
  displayName: string;
};

export default function AddContactDialogue({
  open,
  handleToggle,
}: Props): ReactElement {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    database.ref("users").once("value", (snap) => {
      let users: User[] = [];
      snap.forEach((childSnap) => {
        users.push({
          uid: childSnap.key,
          ...childSnap.val(),
        });
      });

      setUsers(users);
    });
  }, []);

  return (
    <Dialog open={open} onClose={handleToggle}>
      <DialogTitle>Add a contact</DialogTitle>
      <DialogContent>
        {users.map((user) => {
          return <h1 key={user.uid}>{user.displayName}</h1>;
        })}
      </DialogContent>
    </Dialog>
  );
}
