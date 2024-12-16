const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: false,
      default: "NORMAL"
    },
    file: {
      type: String,
      require: false,
    },
  },
  { timestamps: true }
);

const UserModel = mongoose.model("Users", userSchema);
module.exports = UserModel;
