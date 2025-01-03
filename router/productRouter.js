const express = require("express");
const { getAll, getById, create, update, deleteProduct } = require("../controller/productController");
const router = express.Router();
const { isLoggedIn } = require("../middleware/auth");

router.post("/", isLoggedIn, create);
router.get("/", getAll);
router.put("/", isLoggedIn, update);
router.delete("/", isLoggedIn, deleteProduct);
router.get("/id/:id", isLoggedIn, getById);

module.exports = router;
