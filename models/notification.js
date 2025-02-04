const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    senderId: { type: String, require: true },
    userId: { type: String, require: true },
    isRead: { type: Boolean, require: false, default: false },
    message: { type: String, require: false, default: "" },
    chatId: { type: String, require: false, default: "" },
  },
  { timestamps: true }
);

const NotificationsModel = mongoose.model("Notifications", notificationSchema);
module.exports = NotificationsModel;
