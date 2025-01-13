const ChatsModel = require("../models/chat");
const { getLastMessage } = require("./messageController");
const { findUserById } = require("./userController");

const create = async (req, res) => {
  const { firstId, secondId } = req.body;
  const chat = await createChat(firstId, secondId);

  const response = {
    userDetail: chat.userDetail,
    ...chat,
  };

  res.status(200).json(response);
};

const createChat = async (firstId, secondId) => {
  try {
    const chat = await ChatsModel.findOne({
      members: { $all: [firstId, secondId] },
      isOpen: true,
    });
    if (chat) return false;

    const newChat = new ChatsModel({
      members: [firstId, secondId],
    });

    //first id will be always creator Id
    const user = await findUserById(secondId);
    const response = await newChat.save();

    // console.log("response", response);

    return { data: response, userDetail: user };
  } catch (error) {
    console.log(error);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;
  try {
    const chats = await ChatsModel.find({ members: { $in: [userId] } });
    const newChats = await Promise.all(
      chats.map(async (e) => {
        const otherUserId = e.members.filter((i) => i != req.params.userId);
        const user = await findUserById(otherUserId);
        const lastMessage = await getLastMessage(e?._id);
        return { data: e.toObject(), lastMessage, userDetail: user };
      })
    );
    res.status(200).json(newChats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findChat = async (req, res) => {
  const { firstId, secondId } = req.params;
  try {
    const chats = await ChatsModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const isOpenChat = async (userId) => {
  try {
    const isAlreadyOpenChat = await ChatsModel.countDocuments({
      members: { $in: [userId] },
      isOpen: true,
    });
    // console.log("userId", userId);
    // console.log("isAlreadyOpenChat", isAlreadyOpenChat);
    if (isAlreadyOpenChat > 0) return true;
    return false;
  } catch (error) {
    console.log(error);
    // return false
  }
};

const closeChat = async (req, res) => {
  try {
    const { chatId } = req.body;
    console.log("chatId", chatId);
    const response = await ChatsModel.findByIdAndUpdate(
      chatId,
      { $set: { isOpen: false } },
      { new: true }
    ).exec();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = {
  createChat,
  findUserChats,
  findChat,
  create,
  isOpenChat,
  closeChat,
};
