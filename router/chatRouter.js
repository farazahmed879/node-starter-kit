const express = require("express");
const router = express.Router();
const {
  findUserChats,
  findChat,
  create,
} = require("../controller/chatController");
const { isLoggedIn } = require("../middleware/auth");

router.post("/", isLoggedIn, create);
router.get("/:userId", isLoggedIn, findUserChats);
router.get("/find/:firstId/:secondId", isLoggedIn, findChat);

module.exports = router;
