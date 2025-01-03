const NotificationsModel = require("../models/notification");

const createNotification = async (req, res) => {
  const { senderId, userId, isRead, message } = req.body;

  const model = new NotificationsModel({ senderId, userId, isRead, message });

  try {
    const response = await model.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getAllNotificationByUserId = async (req, res) => {
  const userId = req.params.userId;

  try {
    const notifications = await NotificationsModel.find({ userId });
    res.status(200).json(notifications);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const markAllAsReadByUserId = async (req, res) => {
  const userId = req.body.userId;
  try {
    const result = await NotificationsModel.updateMany(
      { userId, isRead: false }, // Condition to find unread notifications for the user
      { $set: { isRead: true } } // Update to mark as read
    );

    return res
      .status(201)
      .json({ message: "All Notification Marked as Read", data: result });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const markAllAsReadByUserIdAndSenderId = async (req, res) => {
  const { userId, senderId } = req.body;

  try {
    const result = await NotificationsModel.updateMany(
      { userId, senderId, isRead: false }, // Condition to find unread notifications for the user
      { $set: { isRead: true } } // Update to mark as read
    );


    return res
      .status(201)
      .json({
        message: "All This User Notification Marked as Read",
        data: result,
      });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const markAsRead = async (req, res) => {
  try {
    const body = req.body;
    const response = await NotificationsModel.findByIdAndUpdate(
      body.id,
      { $set: { isRead: true } }, // Update to mark as read
      { new: true }
    );

    return res
      .status(201)
      .json({ message: "Notification Marked as Read", data: response });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  markAsRead,
  markAllAsReadByUserId,
  getAllNotificationByUserId,
  createNotification,
  markAllAsReadByUserIdAndSenderId,
};
