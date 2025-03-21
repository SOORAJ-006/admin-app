const mongoose = require('mongoose');

const instructorSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: Number,
        required: true,
        // unique: true
    },
    role:{
        type: String,
        enum: ['instructor', 'admin', 'superAdmin'],
        default: 'instructor'
    },
    password: {
        type: String,
        required: true,
    },
    grade:{
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    isActive: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Instructor', instructorSchema);