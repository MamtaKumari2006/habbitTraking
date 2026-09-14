const express = require("express");
const {createHabit, getHabits, getSingleHabit, updateHabit, deleteHabit, markHabitAsCompleted, unmarkedHabitAsCompleted, getSingleHabitAnalytics, getOverallAnalytics} = require("../controllers/Habit.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, createHabit);
router.get("/list/:id", authMiddleware, getSingleHabit);
router.get("/list", authMiddleware, getHabits);
router.put("/list/:id", authMiddleware, updateHabit);
router.delete("/list/:id", authMiddleware, deleteHabit);
router.post("/list/:id/completed", authMiddleware, markHabitAsCompleted);
router.post("/list/:id/uncompleted", authMiddleware, unmarkedHabitAsCompleted);
router.get("/list/:id/analytics", authMiddleware, getSingleHabitAnalytics);
router.get("/analytics", authMiddleware, getOverallAnalytics);
module.exports = router;