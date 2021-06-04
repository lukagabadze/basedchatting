import { ReactElement, useEffect, useState } from "react";
import { Typography } from "@material-ui/core";
import { database } from "../../../firebase";

interface Props {
  name: string;
  members: string[];
}

export default function Contact({ name, members }: Props): ReactElement {
  const [contactName, setContactName] = useState(name);

  useEffect(() => {
    const fetchMemberNames = () => {
      let memberNames: string[] = [];
      members.forEach(async (uid, ind) => {
        const snapshot = await database.ref(`users/${uid}`).once("value");
        const { displayName } = snapshot.val();
        memberNames.push(displayName);

        if (ind === members.length - 1) {
          setContactName(memberNames.join(", "));
        }
      });
    };

    if (!name) return fetchMemberNames();

    setContactName(name);
  }, [name]);

  return <Typography noWrap>{contactName}</Typography>;
}
