const mongoose = require("mongoose");
const requestSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      require: true,
    },
    agentId: { type: String, require: false },
    text: { type: String, require: true },
    isAccepted: { type: String, require: false, default: false },
  },
  { timestamps: true }
);

const RequestModel = mongoose.model("Requests", requestSchema);
module.exports = RequestModel;
