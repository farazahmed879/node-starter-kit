const express = require("express");
const router = express.Router();
const {
  createMessage,
  getMessages,
} = require("../controller/messageController");
const { isLoggedIn } = require("../middleware/auth");

router.post("/",isLoggedIn, createMessage);
router.get("/:chatId",isLoggedIn, getMessages);
module.exports = router;
