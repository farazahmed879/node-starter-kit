require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { isLoggedIn } = require("./middleware/auth");
const dbConnection = require("./connectiondb");
const productRouter = require("./router/productRouter");
const userRouter = require("./router/userRouter");

const app = express();
const port = process.env.PORT || 8080;

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000","http://localhost:3001"], // Adjust these URLs to match your frontend
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

app.use("/product", productRouter);
app.use("/users", userRouter);

dbConnection();

app.get("/", (req, res) => {
  res.status(200).send("<h1>Welcome to backend</h1>");
});

app.listen(port, () => {
  console.log("Server is running");
});
