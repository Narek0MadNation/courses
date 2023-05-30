import mongoose from "mongoose";

const phaseSchema = new mongoose.Schema(
  {
    phaseTitle: { type: String, required: true },
    lesson: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lesson",
        required: false,
      },
    ],
    finalExam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: false,
    },
    course: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Phase = mongoose.model("Phase", phaseSchema);

export default Phase;
