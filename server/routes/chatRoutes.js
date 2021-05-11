const express = require("express");
const router = express.Router();
const chatContollers = require("../contollers/chatControllers");

router.get("/all", chatContollers.all);

module.exports = router;
