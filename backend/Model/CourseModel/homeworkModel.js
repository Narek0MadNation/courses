import mongoose from "mongoose";

const homeworkSchema = new mongoose.Schema(
  {
    homeWorkVideo: { type: String, required: false },
    homeWorkDescription: { type: String, required: true },
    additional: { type: String, required: false },
    homeWorkStatus: { type: Boolean, required: true },
    lesson: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    phase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phase",
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Homework = mongoose.model("Homework", homeworkSchema);

export default Homework;
