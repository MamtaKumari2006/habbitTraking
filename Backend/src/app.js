const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const habitRoutes = require("./routes/Habit.route");

const app = express();

// 1. CORS
app.use(cors());

// 2. JSON parser
app.use(express.json());

// 3. Routes
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

module.exports = app;