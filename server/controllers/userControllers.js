const { admin } = require("../firebaseAdmin");

const allUsers = (req, res) => {
  admin
    .auth()
    .listUsers(2)
    .then((listUsersResult) => {
      return res.status(200).json(listUsersResult);
    });
};

module.exports = {
  allUsers,
};
