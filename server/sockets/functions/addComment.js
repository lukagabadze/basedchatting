const Message = require("../../models/Message");

const addComment = async (text) => {
  const message = new Message({
    text,
    author: "gabo",
  });
  const savedMessage = await message.save();
  console.log(savedMessage);
  return savedMessage;
};

module.exports = addComment;
