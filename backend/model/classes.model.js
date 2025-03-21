const mongoose = require('mongoose')

const classSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Students'
    }],
    fees:{
        type: Number,
        required: true
    },
    address:{
        type: String,
        required: true
    },
    days: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Weeks',
        required: true
    },
    assignedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }]

},{
    timestamps: true,
})

module.exports = mongoose.model('Classes', classSchema);