const mongoose = require("mongoose");

const FeeSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    teacherId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: { type: Number, required: true },
    month: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Months",
      required: true,
    },
    classID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },
    status: { type: String, enum: ['Paid', 'Unpaid', 'Pending'], default: 'Unpaid' },
    paymentDate: { type: Date }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fees", FeeSchema);
