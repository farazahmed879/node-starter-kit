const express = require("express");
const router = express.Router();
const {
  findUserChats,
  findChat,
  create,
  closeChat,
} = require("../controller/chatController");
const { isLoggedIn } = require("../middleware/auth");

router.post("/", isLoggedIn, create);
router.get("/:userId", isLoggedIn, findUserChats);
router.get("/find/:firstId/:secondId", isLoggedIn, findChat);
router.put("/close", isLoggedIn, closeChat);

module.exports = router;
