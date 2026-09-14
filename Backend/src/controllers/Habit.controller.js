const Habit = require("../models/Habit.model");


function normalizeDays(date = new Date()) {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d;

}

function calculateStreak(completedDates) {
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day

    const uniqueDates = [...new Set(completedDates.map(date => normalizeDays(date).getTime()))];
    uniqueDates.sort((a, b) => a - b);
    let longestStreak = 0;
    let streak = 0;

    for (let i = 0; i < uniqueDates.length; i++) {
        if (i === 0 || uniqueDates[i] - uniqueDates[i - 1] === oneDay) {
            streak++;
        } else {
            streak = 1;
        }
        if (streak > longestStreak) {
            longestStreak = streak;
        }
    }
    const today = normalizeDays().getTime();
    let currentStreak = 0;
    let expectedDate = today;

    for (let i = uniqueDates.length - 1; i >= 0; i--) {
        if (uniqueDates[i] === expectedDate) {
            currentStreak++;
            expectedDate -= oneDay;
        } else if (uniqueDates[i] < expectedDate) {
            break;
        }
    }
    return { currentStreak, longestStreak };


}




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


async function deleteHabit(req, res) {
    try {
        const habitId = req.params.id;
        const deletedHabit = await Habit.findOneAndDelete({ _id: habitId, user: req.user._id });

        if (!deletedHabit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        return res.status(200).json({
            message: "Habit deleted successfully"
        });
    } catch (error) {
        console.log("DELETE HABIT ERROR:", error);
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid Habit ID" });
        }
        return res.status(500).json({ message: error.message });
    }
}


async function markHabitAsCompleted(req, res) {
    try {
        const habitId = req.params.id;
        const habit = await Habit.findOne({ _id: habitId, user: req.user._id });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }
        const today = normalizeDays();
        const alreadyCompleted = habit.completedDates.some(date => normalizeDays(date).getTime() === today.getTime());

        if (alreadyCompleted) {
            return res.status(400).json({ message: "Habit already marked as completed for today" });
        }

        habit.completedDates.push(today);

        const { currentStreak, longestStreak } = calculateStreak(habit.completedDates);
        habit.currentStreak = currentStreak;
        habit.longestStreak = longestStreak;
        const updateHabit = await habit.save();


        return res.status(200).json({ message: "Habit marked as completed", habit: updateHabit });
    } catch (error) {
        console.error("MARK HABIT AS COMPLETED ERROR:", error);
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid Habit ID" });
        }
        return res.status(500).json({ message: error.message });
    }
}

async function unmarkedHabitAsCompleted(req, res) {
    try {
        const habitId = req.params.id;
        const habit = await Habit.findOne({ _id: habitId, user: req.user._id });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const today = normalizeDays();
        const alreadyCompleted = habit.completedDates.some(date => normalizeDays(date).getTime() === today.getTime());

        if (!alreadyCompleted) {
            return res.status(400).json({ message: "Habit not marked as completed for today" });
        }

        habit.completedDates = habit.completedDates.filter(date => normalizeDays(date).getTime() !== today.getTime());

        const { currentStreak, longestStreak } = calculateStreak(habit.completedDates);
        habit.currentStreak = currentStreak;
        habit.longestStreak = longestStreak;
        const updateHabit = await habit.save();

        return res.status(200).json({ message: "Habit unmarked as completed", habit: updateHabit });
    } catch (error) {
        console.error("UNMARK HABIT AS COMPLETED ERROR:", error);
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid Habit ID" });
        }
        return res.status(500).json({ message: error.message });
    }
}

async function getSingleHabitAnalytics(req, res) {
    try {
        const habitId = req.params.id;

        const habit = await Habit.findOne({ _id: habitId, user: req.user._id });

        if (!habit) {
            return res.status(404).json({ message: "Habit not found" });
        }

        const today = normalizeDays();
        const startDate = normalizeDays(habit.startDate);

        //total days since habit was started
        const totalDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

        const completedDays = habit.completedDates.length;

        const completionRate = Math.round((completedDays / totalDays) * 100);

        // last completed date
        let lastCompletedDate = null;
        if (habit.completedDates.length > 0) {
            const sortedDates = habit.completedDates.map(date => normalizeDays(date)).sort((a, b) => b - a);
            lastCompletedDate = sortedDates[0];
        }

        //is completed today
        const isCompletedToday = habit.completedDates.some(date => normalizeDays(date).getTime() === today.getTime());

        return res.status(200).json({
            message: "Habit analytics retrieved successfully",
            analytics: {
                habitTitle: habit.title,
                currentStreak: habit.currentStreak,
                longestStreak: habit.longestStreak,
                totalDays,
                completedDays,
                
                completionRate: `${completionRate}%`,
                lastCompletedDate,
                isCompletedToday
            }
        });
    } catch (error) {
        console.error("GET SINGLE HABIT ANALYTICS ERROR:", error);
        if (error.name === "CastError") {
            return res.status(400).json({ message: "Invalid Habit ID" });
        }
        return res.status(500).json({ message: error.message });
    }
}

async function getOverallAnalytics(req, res) {
    try {


        const habits = await Habit.find({ user: req.user._id });

        if (habits.length === 0) {
            return res.status(200).json({
                message: "No habits found for analytics", analytics: {
                    totalHabits: 0,
                    completedToday: 0,
                    pendingToday: 0,
                    bestStreak: 0,
                    totalCompletedDays: 0,
                    overallCompletionRate: "0%",
                }
            });
        }

        const today = normalizeDays();
        let completedToday = 0;
        
        let bestStreak = 0;
        let totalCompletedDays = 0;
        let totalPossibleDays = 0;



        habits.forEach(habit => {
            const isCompletedToday = habit.completedDates.some(date => normalizeDays(date).getTime() === today.getTime());
            if (isCompletedToday) {
                completedToday++;
            } 

            //best streak
            if (habit.longestStreak > bestStreak) {
                bestStreak = habit.longestStreak;
            }

            //total completed days
            totalCompletedDays += habit.completedDates.length;
            //total possible days
            const startDate = normalizeDays(habit.startDate);
            const daySinceStart = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;
            totalPossibleDays += daySinceStart;
        });

        const pendingToday = habits.length - completedToday;

        let overallCompletionRate = 0;
        if (totalPossibleDays > 0) {
            overallCompletionRate = Math.round((totalCompletedDays / totalPossibleDays) * 100);
        }

        return res.status(200).json({
            message: "Overall analytics retrieved successfully",
            analytics: {
                totalHabits: habits.length,
                completedToday,
                pendingToday: pendingToday,
                bestStreak,
                totalCompletedDays,
                overallCompletionRate: `${overallCompletionRate}%`
            }
        });
    } catch (error) {
        console.error("GET OVERALL ANALYTICS ERROR:", error);
        return res.status(500).json({ message: error.message });
    }
}

module.exports = { createHabit, getHabits, getSingleHabit, updateHabit, deleteHabit, markHabitAsCompleted,unmarkedHabitAsCompleted, getSingleHabitAnalytics, getOverallAnalytics };