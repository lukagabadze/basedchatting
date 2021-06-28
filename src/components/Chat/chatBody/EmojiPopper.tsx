import { ReactElement } from "react";
import { IconButton, Popper, Typography, makeStyles } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

const useStyles = makeStyles((theme) => ({
  popperDiv: {
    zIndex: 10,
    backgroundColor: theme.palette.primary.dark,
    padding: theme.spacing(1),
    border: "3px solid white",
    color: "white",
    maxHeight: "250px",
    width: "220px",
    overflowY: "scroll",
    wordBreaK: "break-word",
    userSelect: "none",
  },
  popperHeader: {
    display: "flex",
    justifyContent: "space-between",
  },
}));

interface Props {
  anchorEl: HTMLButtonElement | null;
}

export default function EmojiPopper({ anchorEl }: Props): ReactElement {
  const classes = useStyles();

  return (
    <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} placement="top">
      <div className={classes.popperDiv}>
        <div className={classes.popperHeader}>
          <Typography variant="h6">Emojis</Typography>
          <IconButton color="inherit" size="small">
            <AddCircleOutlineIcon />
          </IconButton>
        </div>
      </div>
    </Popper>
  );
}
