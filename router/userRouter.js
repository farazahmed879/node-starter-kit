const express = require("express");
const {
  signUp,
  getAll,
  login,
  uploadProfile,
  getById,
  userActivation,
} = require("../controller/userController");

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

router.post("/", signUp);
router.get("/:role?", isLoggedIn, getAll);
// router.get("/", isLoggedIn, restrictTo(["ADMIN"]), getAll);
router.post("/login", login);
router.post("/upload", upload.single("file"), uploadProfile);
router.get("/id/:id", isLoggedIn, getById);
router.patch("/activation", isLoggedIn, userActivation);

module.exports = router;
