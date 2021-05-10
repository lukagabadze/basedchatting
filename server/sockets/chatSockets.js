const addComment = require("./functions/addComment");

const chatSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("new client connected");
    socket.on("message", (text) => {
      addComment(text);
    });
  });
};

module.exports = chatSockets;
