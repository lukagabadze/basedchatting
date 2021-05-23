const { Router } = require("express");
const admin = require("firebase-admin");
const userControllers = require("../controllers/userControllers");

const router = Router();

router.get("/all", userControllers.allUsers);

module.exports = router;
