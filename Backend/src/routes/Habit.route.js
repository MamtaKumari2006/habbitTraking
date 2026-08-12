const express = require("express");
const {createHabit, getHabits, getSingleHabit, updateHabit} = require("../controllers/Habit.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.post("/create", authMiddleware, createHabit);
router.get("/list/:id", authMiddleware, getSingleHabit);
router.get("/list", authMiddleware, getHabits);
router.put("/list/:id", authMiddleware, updateHabit);
module.exports = router;