import mongoose from "mongoose";

const subscribeSchema = new mongoose.Schema(
  {
    pending: { type: Boolean, required: true, default: false },
    student: {
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
    subscribedAt: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

const Subscribe = mongoose.model("Subscribe", subscribeSchema);

export default Subscribe;
