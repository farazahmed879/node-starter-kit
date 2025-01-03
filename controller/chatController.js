const ChatsModel = require("../models/chat");
const { getLastMessage } = require("./messageController");

const create = async (req, res) => {
  const { firstId, secondId } = req.body;
  const response = await createChat(firstId, secondId);
  res.status(200).json(response);
};

const createChat = async (firstId, secondId) => {
  try {
    console.log("First ID", firstId);
    console.log("Second ID", secondId);
    const chat = await ChatsModel.findOne({
      members: { $all: [firstId, secondId] },
    });
    console.log("This is chat", chat);
    // if (chat) throw new Error("Chat is already created");

    const newChat = new ChatsModel({
      members: [firstId, secondId],
    });

    const response = await newChat.save();
    return response;
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
        const lastMessage = await getLastMessage(e?._id);
        return { ...e.toObject(), lastMessage };
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
