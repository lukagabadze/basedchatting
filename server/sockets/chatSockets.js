const chatSockets = (io) => {
  io.on("connection", (socket) => {
    console.log("new client connected");
    socket.on("message", (msg) => {
      console.log(msg);
    });
  });
};

module.exports = chatSockets;
