const Habit = require("../models/Habit.model");

async function createHabit(req, res) {
    try {
        console.log("BODY:", req.body);
        console.log("USER:", req.user);

        let { title, description, frequency, customDays, color, reminderTime } = req.body || {};

        if (!req.user) {
            return res.status(401).json({ message: "User not found in request" });
        }

        if (!title || !frequency) {
            return res.status(400).json({ message: "Title and frequency are required" });
        }

        title = title.trim();

        if (title.length === 0) {
            return res.status(400).json({ message: "Title cannot be empty" });
        }

        if (!["daily", "weekly", "monthly"].includes(frequency)) {
            return res.status(400).json({ message: "Invalid frequency" });
        }

        const savedHabit = await Habit.create({
            user: req.user._id,
            title,
            description,
            frequency,
            customDays,
            color,
            reminderTime
        });

        return res.status(201).json({
            message: "Habit created successfully",
            habit: savedHabit
        });

    } catch (error) {
        console.error("CREATE HABIT ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
}

async function getHabits(req, res) {
    try {
        if (!req.user) {
            return res.status(401).json({ message: "User not found in request" });
        }

        const habits = await Habit.find({ user: req.user._id }).sort({ createdAt: -1 });

        return res.status(200).json({
            message: "Habits retrieved successfully",
            count: habits.length,
            habits
        });
    } catch (error) {
        console.error("GET HABITS ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
}

async function getSingleHabit(req, res) {
    try {
        const habitId = req.params.id;

        const habit = await Habit.findOne({ _id: habitId, user: req.user._id });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        return res.status(200).json({
            message: "Habit retrieved successfully",
            habit
        });
    } catch (error) {
        console.error("GET SINGLE HABIT ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
}

async function updateHabit(req, res) {
    try {
        const habitId = req.params.id;
        const { title, description, frequency, customDays, color, reminderTime } = req.body;

        const habit = await Habit.findOne({ _id: habitId, user: req.user._id });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        // Update the habit fields
        if (title !== undefined) {
            if (typeof title !== "string" || title.trim().length === 0) {
                return res.status(400).json({ message: "Title must be a non-empty string" });
            }
            habit.title = title.trim();
        }
        if (description !== undefined) habit.description = description;
        if (frequency !== undefined) {
            if (!["daily", "weekly", "monthly"].includes(frequency)) {
                return res.status(400).json({ message: "Invalid frequency" });
            }
            habit.frequency = frequency;
        };
        if (customDays !== undefined) habit.customDays = customDays;
        if (color !== undefined) habit.color = color;
        if (reminderTime !== undefined) habit.reminderTime = reminderTime;

        const updatedHabit = await habit.save();

        return res.status(200).json({
            message: "Habit updated successfully",
            habit: updatedHabit
        });
    } catch (error) {
        console.log("UPDATE HABIT ERROR:", error);
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid Habit ID" });
        }
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { createHabit, getHabits, getSingleHabit, updateHabit };