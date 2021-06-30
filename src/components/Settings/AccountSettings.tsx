import { ReactElement, useState } from "react";
import { Button, Typography } from "@material-ui/core";
import { database, storage } from "../../firebase";

export default function AccountSettings(): ReactElement {
  const [files, setFiles] = useState<File[]>([]);

  return (
    <Typography variant="h4" align="center" gutterBottom>
      <Typography color="error" variant="h2">
        !!!WARNING!!!
      </Typography>
      <Typography color="error" variant="h4">
        ამეებს ნებართვის გარეშე არ დააჭირო, გთხოვ
      </Typography>

      <br />
      <Button
        variant="contained"
        onClick={async () => {
          const snapshot = await database.collection("contacts").get();

          snapshot.forEach(async (doc) => {
            const data = doc.data();

            const contactDoc = database.doc(`contacts/${doc.id}`);

            await contactDoc.update({
              seenBy: [],
            });

            console.log(`Successfully updated - ${data.name}`);
          });
        }}
      >
        Click me to witness magic
      </Button>
      <form
        onSubmit={(e: React.FormEvent) => {
          e.preventDefault();

          if (!files) return;

          files.forEach(async (file) => {
            const fileName = `${file.name}-${Date.now()}`;
            const storageRef = storage.ref(`emojis/${fileName}`);
            await storageRef.put(file);

            console.log(`successfully added emoji - ${fileName}`);
          });
        }}
      >
        <input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (files) setFiles(Array.from(files));
          }}
          type="file"
          multiple
        />
        <Button variant="contained" type="submit">
          Upload emojis
        </Button>
      </form>
    </Typography>
  );
}
