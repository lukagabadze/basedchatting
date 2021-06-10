import React, { ReactElement, useState } from "react";
import {
  Container,
  useMediaQuery,
  useTheme,
  makeStyles,
  Tabs,
  Tab,
  Paper,
} from "@material-ui/core";

import ProfileSettings from "./ProfileSettings";
import TabPanel from "./TabPanel";
import AccountSettings from "./AccountSettings";

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: "50px",
  },
  paper: {
    padding: theme.spacing(2),
  },
}));

export default function Settings(): ReactElement {
  const [value, setValue] = useState(0);

  const classes = useStyles();
  const theme = useTheme();
  const mdDown = useMediaQuery(theme.breakpoints.down("md"));

  function handleChange(e: React.ChangeEvent<{}>, newVal: number) {
    setValue(newVal);
  }

  return (
    <Container maxWidth={mdDown ? "sm" : "md"} className={classes.container}>
      <Paper elevation={3} className={classes.paper}>
        <Tabs
          value={value}
          onChange={handleChange}
          variant="scrollable"
          indicatorColor="primary"
        >
          <Tab label="Profile" />
          <Tab label="Account" />
        </Tabs>
        <TabPanel value={value} index={0}>
          <ProfileSettings />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <AccountSettings />
        </TabPanel>
      </Paper>
    </Container>
  );
}
