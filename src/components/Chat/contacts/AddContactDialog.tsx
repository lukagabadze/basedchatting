import { ReactElement, useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@material-ui/core";

interface Props {
  open: boolean;
  handleToggle: () => void;
}

export default function AddContactDialogue({
  open,
  handleToggle,
}: Props): ReactElement {
  return (
    <Dialog open={open} onClose={handleToggle}>
      <DialogTitle>Add a contact</DialogTitle>
      <DialogContent>zd gabo</DialogContent>
    </Dialog>
  );
}
