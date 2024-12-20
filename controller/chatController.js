const ChatsModel = require("../models/chat");

const createChat = async (req, res) => {
  const { firstId, secondId } = req.body;
  console.log(req?.body);
  try {
    const chat = await ChatsModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    if (chat) return res.status(200).json(chat);

    const newChat = new ChatsModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();

    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const findUserChats = async (req, res) => {
  const userId = req.params.userId;

  try {
    const chats = await ChatsModel.find({ members: { $in: [userId] } });
    res.status(200).json(chats);
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

module.exports = { createChat, findUserChats, findChat };
