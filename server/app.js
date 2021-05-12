const express = require("express");
require("dotenv").config();
const http = require("http");
const socketio = require("socket.io");
const cors = require("cors");
const chatSockets = require("./sockets/chatSockets");

const app = express();
const server = http.createServer(app);
const io = socketio(server);
chatSockets(io);

// connect to db and listen to port
const mongoose = require("mongoose");
const PORT = 4000 | process.env.PORT;
mongoose.connect(
  process.env.MONGO_URI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("connected to db");
    server.listen(PORT, () => {
      console.log("listening to port 4000");
    });
  }
);

// middleware
app.use(cors());
app.use(express.json());
app.options("*", cors());

// routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
app.use("/auth", authRoutes);
app.use("/chat", chatRoutes);
