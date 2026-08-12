const mongoose = require ('mongoose');

const habitSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: [true, 'Title is required'],
        trim: true,
        maxlength: [100, 'Title must not exceed 100 characters']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [200, 'Description must not exceed 200 characters'],
        default: ''
    },
    frequency: {
        type: String,
        enum: ['daily', 'weekly', 'monthly'],
        required: [true, 'Frequency is required'],
        default: 'daily'
    },
    customDays: [
      {
        type: String,
        enum: [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ],
      },
    ],
    color: {
        type: String,
        default: '#4CAF50'
    },
    completedDates: [
        {
            type: Date
        }
    ],
    currentStreak: {
        type: Number,
        default: 0
    },
    longestStreak: {
        type: Number,
        default: 0
    },
    reminderTime: {
        type: String,
        default: null
    },
    isAchieved: {
        type: Boolean,
        default: false
    },
    startDate: {
        type: Date,
        default: Date.now
    },
}, { timestamps: true });


module.exports = mongoose.model('Habit', habitSchema);
