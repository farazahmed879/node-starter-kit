const RequestsModel = require("../models/request");
const { createChat } = require("./chatController");

const createRequest = async (req, res) => {
  const { senderId, agentId, text, isAccepted } = req.body;
  try {
    const message = new RequestsModel({ senderId, text });

    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const acceptRequest = async (req, res) => {
  const { id, agentId } = req.body;
  try {
    const response = await RequestsModel.findByIdAndUpdate(id, {
      $set: { isAccepted: true, agentId: agentId },
    });

    if (!response) throw new Error("Request not found or could not be updated");
    //create chat
    const chatresponse = await createChat({
      firstId: response.senderId,
      secondId: response.agentId,
    });

    res.status(200).json({ ...response, chat: chatresponse });
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

const getAll = async (req, res) => {
  try {
    const response = await RequestsModel.find({ isAccepted: false })
      .populate("senderId")
      .exec();
    console.log(response);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

module.exports = { createRequest, acceptRequest, getAll };
