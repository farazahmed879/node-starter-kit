const express = require("express");
const router = express.Router();
const { getMessages, create } = require("../controller/messageController");
const { isLoggedIn } = require("../middleware/auth");

router.post("/", isLoggedIn, create);
router.get("/:chatId", isLoggedIn, getMessages);
module.exports = router;
