const mongoose = require('mongoose');

const monthSchema = mongoose.Schema({
    month: {
        type: String,
        required: true,
        enum: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    }
});

module.exports = mongoose.model('Months', monthSchema);