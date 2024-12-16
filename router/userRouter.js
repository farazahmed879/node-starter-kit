const express = require("express");
const UserController = require("../controller/userController");
const { isLoggedIn, restrictTo } = require("../middleware/auth");
const router = express.Router();
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

router.post("/", UserController.signUp);
router.get("/", isLoggedIn, restrictTo(["ADMIN"]), UserController.getAll);
router.post("/login", UserController.login);
router.post("/upload", upload.single("file"), UserController.uploadProfile);

module.exports = router;
