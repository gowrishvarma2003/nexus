const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {  // Make sure to hash this in production
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'professor', 'student'],
        required: true
    },
    // Only applicable for professors: the courses they manage
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
