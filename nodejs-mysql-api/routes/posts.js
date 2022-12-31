//importing the express framework
const express = require("express");
const postController = require("../controllers/post.controller");
const checkAuthMiddleware = require("../middleware/check-auth");

const router = express.Router();

router.post("/", checkAuthMiddleware.checkAuth, postController.save);
router.get("/:id", postController.show);
router.get("/", postController.index);
router.patch("/:id", postController.update);
router.delete("/:id", postController.destroy);

module.exports = router;
