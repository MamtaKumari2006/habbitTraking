const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const habitRoutes = require("./routes/Habit.route");
const cookieParser = require("cookie-parser");

const app = express();


app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

module.exports = app;