const mongoose = require('mongoose');
const { Schema } = mongoose;

const courseSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: String,
    credits: {
        type: Number,
        required: true
    },
    courseCode: {
        type: String,
        required: true
    },
    semester: {
        type: String
    },
    program: {
        type: Schema.Types.ObjectId,
        ref: 'Program',
        required: true
    },
    // Now store the professor's email (instead of ObjectId)
    professor: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Course', courseSchema);
