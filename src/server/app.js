const express = require("express");
const path = require("path");
const cors = require("cors");
const routes = require("./routes");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api", routes);

// Static frontend
app.use(express.static(path.join(__dirname, "../client")));
app.use("/data", express.static(path.join(__dirname, "../../data")));

// Catch-all for SPA navigation
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(__dirname, "../client/index.html"));
});

module.exports = app;
