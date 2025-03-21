const mongoose = require('mongoose');

const weekSchema = mongoose.Schema({
    day: {
        type: String,
        required: true,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    },
    // startTime: {
    //     type: String,
    //     required: true
    // },
    // endTime: {
    //     type: String,
    //     required: true
    // }
},{
    timestamps: true
});

module.exports = mongoose.model('Weeks', weekSchema)
