const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    members: Array,
  },
  { timestamps: true }
);

const ChatsModel = mongoose.model("Chats", chatSchema);
module.exports = ChatsModel;
