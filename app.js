require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");
const { isLoggedIn } = require("./middleware/auth");
const dbConnection = require("./connectiondb");
const productRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");
const chatRouter = require("./router/chatRouter");
const messageRouter = require("./router/messageRouter");
const notificationRouter = require("./router/notificationRouter");
const requestRouter = require("./router/requestRouter");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require('path');

const app = express();
const port = process.env.PORT || 8080;
app.use(cookieParser());
const corsOptions = {
  credentials: true,
  origin: [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://localhost:4200",
  ], // Adjust these URLs to match your frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/product", productRouter);
app.use("/users", userRouter);
app.use("/chats", chatRouter);
app.use("/messages", messageRouter);
app.use("/notifications", notificationRouter);
app.use("/requests", requestRouter);

app.get("/check-auth", async (req, res) => {
  const token = req?.cookies?.authToken;
  console.log(token, "token");
  if (!token) {
    console.log("token nh mila)");
    return res
      .status(401)
      .json({ message: "Unauthorized", authenticated: false });
  }

  try {
    console.log("try");
    const decoded = jwt.verify(token, "S3cUreK3y!2023#Taqr33b@t");
    console.log(decoded);
    res.json({ message: "Access granted", user: decoded, authenticated: true });
  } catch (error) {
    console.log(error);
    res.status(403).json({ message: "Invalid token" });
  }
});

dbConnection();

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to backend</h1>");
});

app.listen(port, () => {
  console.log(`Server is running ${port}`);
});
