import mongoose from "mongoose";

const examSchema = new mongoose.Schema(
  {
    phase: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Phase",
      required: true,
    },
    examTitle: {
      type: String,
      required: true,
    },
    examDescription: {
      type: String,
      required: true,
    },
    examPassingValue: {
      type: Number,
      required: true,
    },
    examPassingTime: {
      type: Number,
      required: true,
    },
    additional: {
      type: String,
      required: false,
    },
    examQuestion: [
      {
        question: {
          type: String,
          required: true,
        },
        answers: {
          type: Array,
          default: [],
        },
      },
    ],
    examStatus: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Exam = mongoose.model("Exam", examSchema);

export default Exam;
