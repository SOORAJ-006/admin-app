
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    occurrences: [
        {
            location: { type: String }, // If event occurs at a place
            classId: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }, // If event occurs in a classroom
            startDate: { type: Date, required: true }, // Start date of the event
            endDate: { type: Date, required: true }, // End date of the event
            assignedClasses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }] // Classes attending this event
        }
    ],
    participants: [
        {
            studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
            grade: { type: String, required: true },
            feeAmount: { type: Number, required: true },
            feeStatus: { type: String, enum: ["Unpaid", "Paid"], default: "Unpaid" },
            addedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" } // Teacher who added the student
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Event", EventSchema);