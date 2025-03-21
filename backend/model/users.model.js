const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    userName: {
        type: String,
        required: true,
        unique: true
    },
    phone:{
        type: Number,
        required: true,
        // unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['instructor', 'admin'],
        default: 'instructor'
    },
    assignedClasses:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classes'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
},{
    timestamps: true
})

module.exports = mongoose.model('Users', userSchema)