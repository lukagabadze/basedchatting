const { Router } = require("express");
const userControllers = require("../controllers/userControllers");

const router = Router();

router.get("/users", userControllers.allUsers);
router.get("/users/:query", userControllers.queryUsers);

module.exports = router;
