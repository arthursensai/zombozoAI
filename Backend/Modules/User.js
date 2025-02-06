const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'No valid Username'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'No valid Email'],
        unique: true,
        trim: true
    },
    firebaseUID: {
        type: String,
        required: true,
        unique: true
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;
