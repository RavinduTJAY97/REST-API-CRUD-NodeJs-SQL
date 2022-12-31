//importing the express framework
const express = require("express");
const userController = require("../controllers/user.controller");

const router = express.Router();

router.post("/signUp", userController.signUp);
router.post("/login", userController.login);

module.exports = router;
