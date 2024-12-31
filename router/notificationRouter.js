const express = require("express");
const router = express.Router();
const {
  markAsRead,
  markAllAsReadByUserId,
  getAllNotificationByUserId,
  createNotification,
  markAllAsReadByUserIdAndSenderId,
} = require("../controller/notificationController");

router.post("/", createNotification);
router.post("/markRead/", markAsRead);
router.post("/markAllRead/", markAllAsReadByUserId);
router.post("/markReadByUserId/", markAllAsReadByUserIdAndSenderId);
router.get("/:userId", getAllNotificationByUserId);

module.exports = router;
