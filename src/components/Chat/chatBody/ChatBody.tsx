import { Grid, makeStyles, TextField } from "@material-ui/core";
import { ReactElement } from "react";

interface Props {}

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

export default function ChatBody({}: Props): ReactElement {
  const classes = useStyles();

  return (
    <Grid
      container
      direction="column"
      justify="space-between"
      className={classes.gridContainer}
    >
      <Grid container className={classes.chatMessagesDiv}>
        <Grid item>Chat Messages</Grid>
        <Grid item style={{ marginLeft: "auto" }}>
          Chat Messages
        </Grid>
        <Grid item>Chat Messages</Grid>
        <Grid item>Chat Messages</Grid>
        <Grid item style={{ marginLeft: "auto" }}>
          Chat Messages
        </Grid>
      </Grid>
      <Grid item className={classes.chatInput}>
        <TextField variant="outlined" fullWidth margin="dense" />
      </Grid>
    </Grid>
  );
}
