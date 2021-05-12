const express = require("express");
const router = express.Router();
const authControllers = require("../contollers/authControllers");
const checkAuth = require("../middleware/checkAuth");

router.post("/signup", authControllers.signup);
router.post("/login", authControllers.login);
router.delete("/logout", authControllers.logout);
router.post("/access_token", authControllers.generateAccessToken);

router.get("/user", checkAuth, authControllers.getUser);

module.exports = router;
