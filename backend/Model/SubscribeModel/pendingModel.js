import mongoose from "mongoose";

const pendingSchema = new mongoose.Schema(
  {
    pending: { type: Boolean, required: true, default: true },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    courseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    requestedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const Pending = mongoose.model("Pending", pendingSchema);

export default Pending;
