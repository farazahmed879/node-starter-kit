const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: false,
    },
    file: {
      type: String,
      require: false,
    },
  },
  { timestamps: true }
);

const ProductsModel = mongoose.model("Products", productSchema);
module.exports = ProductsModel;
