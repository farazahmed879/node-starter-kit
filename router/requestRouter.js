const express = require("express");
const router = express.Router();
const {
  createRequest,
  acceptRequest,
  getAll,
} = require("../controller/requestController");

router.post("/", createRequest);
router.put("/", acceptRequest);
router.get("/", getAll);

module.exports = router;
