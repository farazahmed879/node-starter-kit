const express = require("express");
const ProductController = require("../controller/productController");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");

router.post("/", isLoggedIn, ProductController.create);
router.get("/", ProductController.getAll);
router.put("/", isLoggedIn, ProductController.update);
router.delete("/", isLoggedIn, ProductController.delete);
router.get("/id/:id", isLoggedIn, ProductController.getById);

module.exports = router;
