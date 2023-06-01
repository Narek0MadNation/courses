import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
  {
    pending: { type: Boolean, required: true, default: true },
    title: { type: String, required: true },
    image: { type: String, required: false },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
      required: true,
    },
    description: { type: String, required: true },
    ageLimit: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },
    finalExam: { type: Boolean, required: true },
    certificate: { type: Boolean, required: true },
    price: { type: Number, required: true }, // ????
    phases: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Phase",
        required: false,
      },
    ],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: false,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
    rating: [
      {
        rater: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Student",
          required: false,
        },
        rate: { type: Number, required: false },
      },
    ],
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId },
        comment: { type: String, required: false },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Course = mongoose.model("Course", courseSchema);

export default Course;
