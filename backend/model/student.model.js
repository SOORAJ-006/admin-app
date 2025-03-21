const mongoose = require("mongoose");

const StudentSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: Number,
      required: true,
      // unique: true
    },
    grade: {
      type: String,
      required: true,
    },
    profilePicture: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    fees: [{ type: mongoose.Schema.Types.ObjectId, ref: "Fee" }],
    assignedClasses: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Classes",
      required: true,
    },
    parentContact: { 
      name: { type: String, required: true }, 
      phone: { type: String, required: true }
    },
    assignedBy:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Students", StudentSchema);
