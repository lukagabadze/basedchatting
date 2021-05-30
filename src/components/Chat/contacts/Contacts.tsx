import { ReactElement, useState } from "react";
import { Box, List, makeStyles, Typography, Fab } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import AddContactDialog from "./AddContactDialog";

const useStyles = makeStyles({
  list: {
    direction: "rtl",
    height: "100%",
    overflow: "auto",
  },
  listItem: {
    direction: "ltr",
    borderTop: "1px solid black",
  },
  contactsHeader: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row-reverse",
    margin: "10px",
  },
  addContactButton: {},
});

export default function Contacts(): ReactElement {
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    return setOpen(!open);
  };

  return (
    <>
      <List className={classes.list}>
        <Box className={classes.contactsHeader}>
          <Typography variant="h3">Contacts</Typography>
          <Fab
            color="primary"
            className={classes.addContactButton}
            onClick={handleToggle}
          >
            <AddIcon />
          </Fab>
        </Box>
      </List>
      <AddContactDialog open={open} handleToggle={handleToggle} />
    </>
  );
}
