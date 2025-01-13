const RequestsModel = require("../models/request");
const { createChat, isOpenChat } = require("./chatController");
const { createMessage } = require("./messageController");

const createRequest = async (req, res) => {
  const { senderId, agentId, text, isAccepted } = req.body;
  try {
    const isChatExist = await isOpenChat(senderId);


    if (isChatExist)
      return res.status(200).json({
        success: false,
        message: "Your already have an open chat, please close it first",
      });

    const requests = await RequestsModel.countDocuments({
      senderId,
      isAccepted: false,
    });
    if (requests > 0)
      return res
        .status(200)
        .json({ success: false, message: "You have already sent a request" });

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
    const chatresponse = await createChat(
      agentId,
      response.senderId.toString()
    );


    const messageResponse = await createMessage(
      chatresponse?.data?._id.toString(),
      response.senderId.toString(),
      response.text
    );

    res
      .status(200)
      .json({ ...response, chat: chatresponse, message: messageResponse });
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
