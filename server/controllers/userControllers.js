const { admin } = require("../firebaseAdmin");

const allUsers = (req, res) => {
  admin
    .auth()
    .listUsers(6)
    .then((listUsersResult) => {
      const users = listUsersResult.users.map((user) => {
        return {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
        };
      });
      return res.status(200).json(users);
    });
};

const queryUsers = (req, res) => {
  const { query } = req.params;
  admin
    .auth()
    .listUsers(1000)
    .then((listUsersResult) => {
      let users = [];
      listUsersResult.users.map((user) => {
        if (
          user.email.includes(query) ||
          (user.displayName && user.displayName.includes(query))
        )
          users.push({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
      });
      return res.status(200).json(users);
    });
};

module.exports = {
  allUsers,
  queryUsers,
};
