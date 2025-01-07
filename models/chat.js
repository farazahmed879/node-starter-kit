const mongoose = require("mongoose");
const chatSchema = new mongoose.Schema(
  {
    members: Array,
    isOpen: { type: Boolean, false: true, default: true },
  },
  { timestamps: true }
);

const ChatsModel = mongoose.model("Chats", chatSchema);
module.exports = ChatsModel;
