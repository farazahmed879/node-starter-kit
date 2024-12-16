const ProductstModel = require("../models/products");

const ProductController = {
  getAll: async (req, res) => {
    try {
      const data = await ProductstModel.find({});
      return res.status(200).json({ message: "success", data: data });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },

  getById: async (req, res) => {
    try {
      const data = await ProductstModel.findById(req.params.id);
      return res.status(200).json({ message: "success", data: data });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },

  create: async (req, res) => {
    try {
      const body = req.body;
      const isStudent = await ProductstModel.findOne({ name: body.name });
      if (isStudent) return res.status(404).json({ message: "Already Exist" });
      const data = await ProductstModel.create(body);
      return res.status(201).json({ message: "Client  Created", data: data });
    } catch (e) {
      console.log(e);
      res.status(500).json({ message: e });
    }
  },

  update: async (req, res) => {
    try {
      const body = req.body;
      const isSideMenuExist = await ProductstModel.findByIdAndUpdate(body.id, {
        body,
      });
      // if (isSideMenuExist)
      //   return res.status(404).json({ message: "Already Exist" });
      // const data = await ProductstModel.create({ content, type });
      return res.status(201).json({ message: "Client  Created", data: data });
    } catch (e) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  delete: async (req, res) => {
    try {
      const data = await ProductstModel.findByIdAndDelete(req.param.id);
      return res.status(201).json({ message: "Client  Deleted", data: data });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  },
};

module.exports = ProductController;
