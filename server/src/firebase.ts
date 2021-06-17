import * as admin from "firebase-admin";
const serviceAccount = require("../serviceAccountKey.json");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL:
    "https://basedchattingauth-dev-default-rtdb.europe-west1.firebasedatabase.app",
});

export const database = app.firestore();
