const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");
const profileRoutes = require("./routes/profileRoutes");

app.use(express.json());
app.use(cors());

// Database Connection
const mongoUrl = process.env.MONGODB_URL;
mongoose.connect(mongoUrl, err => {
  if (err) throw err;
  console.log("Mongodb connected...");
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/profile", profileRoutes);

// Serve frontend in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.resolve(__dirname, "../frontend/build")));
  app.get("*", (req, res) => res.sendFile(path.resolve(__dirname, "../frontend/build/index.html")));
}

// Export the app for Vercel (instead of app.listen)
module.exports = app;
