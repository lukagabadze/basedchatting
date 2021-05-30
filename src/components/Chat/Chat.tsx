import { ReactElement } from "react";
import Contacts from "./contacts/Contacts";
import ChatBody from "./chatBody/ChatBody";
import { Grid } from "@material-ui/core";

interface Props {}

export default function Chat({}: Props): ReactElement {
  return (
    <Grid
      container
      style={{
        height: "100%",
      }}
    >
      <Grid
        item
        xs={3}
        style={{
          height: "100%",
        }}
      >
        <Contacts />
      </Grid>
      <Grid item xs={9}>
        <ChatBody />
      </Grid>
    </Grid>
  );
}
