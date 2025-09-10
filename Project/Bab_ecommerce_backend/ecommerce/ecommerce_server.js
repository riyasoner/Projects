require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// require("./src/services/autoMarkDelivered.js");

app.use(
  cors({
    credentials: true,
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    allowedHeaders: "Content-Type,Authorization",
  })
);

const mainRoutes = require("./src/routes/main.routes");

app.use("/ecommerce", mainRoutes);

app.get("/", (req, res) => {
  res.send(
    `Hello ecommerce web services, Server  is running on port : ${process.env.PORT}`
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running for E-commerce  at ${process.env.PORT}`);
});
