const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.route");
const habitRoutes = require("./routes/Habit.route");

const app = express();

app.use(express.json());
app.use(cors({
  origin: [
    "https://habbit-traker-kh8q6lgt9-mamtakumari2006s-projects.vercel.app/",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use("/api/auth", authRoutes);
app.use("/api/habits", habitRoutes);

module.exports = app;