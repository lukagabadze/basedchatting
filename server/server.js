const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = 4000 || process.env.PORT;

server.listen(PORT, () => {
  console.log(`listening to port ${PORT}`);
});

io.on("connection", (socket) => {
  console.log("new user connected");
});

// middleware
app.use(cors());

// routes
const userRoutes = require("./routes/userRoutes");
app.use("/user", userRoutes);
