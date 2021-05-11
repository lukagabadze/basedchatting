const addMessage = require("./functions/addMessage");

const chatSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("new client connected");
    socket.on("message", async (text) => {
      const message = await addMessage(text);
      socket.emit("messageSuccess", message);
    });
  });
};

module.exports = chatSockets;
