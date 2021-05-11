const Message = require("../models/Message");

const all = async (req, res) => {
  const messages = await Message.find({});
  return res.json({ messages });
};

module.exports = {
  all,
};
