import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    lessonTitle: {
      type: String,
      required: true,
    },
    lessonTiming: {
      type: Number,
      required: true,
    },
    lessonLink: {
      type: String,
      required: false,
    },
    lessonDescription: {
      type: String,
      required: true,
    },
    additional: {
      type: String,
      required: false,
    },
    lessonStatus: {
      type: Boolean,
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
    homework: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Homework",
        required: false,
      },
    ],
    finalExam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Lesson = mongoose.model("Lesson", lessonSchema);

export default Lesson;
