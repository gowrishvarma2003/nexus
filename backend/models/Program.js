const mongoose = require('mongoose');
const { Schema } = mongoose;

const programSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: String,
    courses: [{
        type: Schema.Types.ObjectId,
        ref: 'Course'
    }]
}, { timestamps: true });

module.exports = mongoose.model('Program', programSchema);
