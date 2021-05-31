const { Router } = require("express");
const userControllers = require("../controllers/userControllers");

const router = Router();

router.get("/all", userControllers.allUsers);
router.get("/find/:query", userControllers.queryUsers);

module.exports = router;
