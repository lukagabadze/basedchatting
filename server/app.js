const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const chatSockets = require("./sockets/chatSockets");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
chatSockets(io);

// connect to db and listen to port
const PORT = 4000 | process.env.PORT;
server.listen(PORT, () => {
  console.log("listening to port 4000");
});

// middleware
app.use(cors());
app.options("*", cors());

// routes
app.get("/chat", (req, res) => {
  return res.send("zd gabo");
});
