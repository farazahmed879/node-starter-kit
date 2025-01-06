const ChatsModel = require("../models/chat");
const { getLastMessage } = require("./messageController");
const { findUserById } = require("./userController");

const create = async (req, res) => {
  const { firstId, secondId } = req.body;
  const chat = await createChat(firstId, secondId);

  console.log("chat", chat);
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
    });
    console.log("This is chat", chat);
    if (chat) return false;

    const newChat = new ChatsModel({
      members: [firstId, secondId],
    });

    const user = await findUserById(secondId);
    const response = await newChat.save();

    console.log("response", response);

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

module.exports = { createChat, findUserChats, findChat, create };
