const express = require("express");
const router = express.Router();
const {
  markAsRead,
  markAllAsReadByUserId,
  getAllNotificationByUserId,
  createNotification,
  markAllAsReadByUserIdAndSenderId,
} = require("../controller/notificationController");
const { isLoggedIn } = require("../middleware/auth");

router.post("/",isLoggedIn, createNotification);
router.post("/markRead/",isLoggedIn, markAsRead);
router.post("/markAllRead/",isLoggedIn, markAllAsReadByUserId);
router.post("/markReadByUserId/",isLoggedIn, markAllAsReadByUserIdAndSenderId);
router.get("/:userId",isLoggedIn, getAllNotificationByUserId);

module.exports = router;
