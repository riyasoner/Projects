require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");
const cron = require("node-cron");
const { apiLimiter, apiSpeedLimiter } = require("./src/middleware/ratelimit");

const app = express();
app.set("trust proxy", 1);

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());

app.use(
  cors({
    origin: "*",
    credentials: true,
    methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const mainRoutes = require("./src/routes/main.routes");
const {
  processScheduledEmi,
} = require("./src/controller/transaction_controller/transaction.controller");

app.use("/account_book", apiSpeedLimiter, apiLimiter, mainRoutes);

app.get("/", (req, res) => {
  res.send(
    `Hello Money Manager, Server  is running on port :${process.env.PORT} `
  );
});

cron.schedule("0 12 * * *", async () => {
  // cron.schedule("* * * * *", async () => {
  // Runs once at 12:00 pm
  console.log("Checking for due EMIs...");
  await processScheduledEmi();
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running for Account Book at ${process.env.PORT}`);
});
