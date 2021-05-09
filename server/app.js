const express = require("express");
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = socketio(server);

// handle sockets
// io.on("connection", (socket) => {
//   console.log("new client connected");
//   socket.emit("message", "gaboooooooo");
// });

let interval;

io.on("connection", (socket) => {
  console.log("New client connected");
  if (interval) {
    clearInterval(interval);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    clearInterval(interval);
  });
});

const getApiAndEmit = (socket) => {
  console.log("hello");
  const response = new Date();
  // Emitting a new message. Will be consumed by the client
  socket.emit("FromAPI", response);
};

// connect to db and listen to port
const PORT = 4000 | process.env.PORT;
app.listen(PORT, () => {
  console.log("listening to port 4000");
});

// middleware

// routes
app.get("/", (req, res) => {
  return res.send("zd gabo");
});
