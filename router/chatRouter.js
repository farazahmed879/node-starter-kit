const express = require("express");
const router = express.Router();
const {
  findUserChats,
  findChat,
  create
} = require("../controller/chatController");

router.post("/", create);
router.get("/:userId", findUserChats);
router.get("/find/:firstId/:secondId", findChat);

module.exports = router;
