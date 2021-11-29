const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const SendResponse = require("./helper/SendResponse/SendResponse");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const app = express();

// Set the limit for api request
const limiter = rateLimit({
  windowMs: 1000,
  max: 3,
  handler: function (req, res, next) {
    res.send(
      SendResponse(false, "Too many requests sent, Please try again later", {})
    );
  },
});

app.use(limiter);
app.use(cookieParser());
app.use(helmet());
app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://next-app-sandy-beta.vercel.app",
      "https://next-jst-est-ecuplqqy3-firasel.vercel.app",
    ],
    credentials: true,
    secure: true,
    sameSite: "none",
  })
);

const userHandler = require("./routeHandler/userHandler");
const taskHandler = require("./routeHandler/taskHandler");

const port = process.env.PORT || 3001;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lwdhb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

// Connect with databse and run the application
mongoose
  .connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    app.listen(port, () => console.log("Server runing is port", port))
  )
  .catch((err) => console.log(err));

// Routes
app.use("/user", userHandler);

// Routes
app.use("/task", taskHandler);

// Test
app.get("/", (req, res) => {
  res.send("Api is worikng");
});

// Error handling
app.use((err, req, res, next) => {
  if (err) {
    res.status(500).send(SendResponse(false, "Internal server error"));
  }
});
