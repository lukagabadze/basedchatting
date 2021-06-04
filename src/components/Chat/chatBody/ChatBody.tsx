import { ReactElement, useEffect, useState } from "react";
import { Grid, makeStyles, TextField } from "@material-ui/core";
import { ContactType } from "../contacts/Contacts";

interface Props {
  contactProp: ContactType | null;
}

const useStyles = makeStyles({
  gridContainer: {
    backgroundColor: "lightgray",
    height: "100%",
    padding: 6,
  },
  chatMessagesDiv: {
    backgroundColor: "lightblue",
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  chatInput: {
    backgroundColor: "lightyellow",
  },
});

export default function ChatBody({ contactProp }: Props): ReactElement {
  const classes = useStyles();
  const [contact, setContact] = useState<ContactType | null>(contactProp);

  useEffect(() => {
    setContact(contactProp);
  }, [contactProp]);

  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      className={classes.gridContainer}
    >
      {contact && contact.name}
      <Grid container className={classes.chatMessagesDiv}></Grid>
      <Grid item className={classes.chatInput}>
        <TextField variant="outlined" fullWidth margin="dense" />
      </Grid>
    </Grid>
  );
}
