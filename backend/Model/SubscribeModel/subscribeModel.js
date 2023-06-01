import mongoose from "mongoose";

const subscribeModel = new mongoose.Schema({
  pending: { type: Boolean, required: true, default: false },
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
  subscribedAt: { type: Date, required: true },
});

const Subscribe = mongoose.model("Subscribe", subscribeModel);

export default Subscribe;
