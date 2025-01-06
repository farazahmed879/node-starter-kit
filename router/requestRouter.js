const express = require("express");
const router = express.Router();
const {
  createRequest,
  acceptRequest,
  getAll,
} = require("../controller/requestController");
const { isLoggedIn } = require("../middleware/auth");

router.post("/", isLoggedIn, createRequest);
router.put("/", isLoggedIn, acceptRequest);
router.get("/", isLoggedIn, getAll);

module.exports = router;
