const MessageModel = require("../models/message");

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const message = new MessageModel({ chatId, senderId, text });

  try {
    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getAll = async (chatId) => {
  try {
    const messages = await MessageModel.find({ chatId });
    return messages;
  } catch (error) {
    console.log(error);
  }
};

const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await getAll(chatId);
    res.status(200).json(messages);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getLastMessage = async (chatId) => {
  const messages = await getAll(chatId);
  const lastElement = messages[messages?.length - 1];
  return lastElement;
};

module.exports = { createMessage, getMessages, getLastMessage };
