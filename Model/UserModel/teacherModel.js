import mongoose from "mongoose";

const teacherSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, default: "teacher" },
    isIndividual: { type: Boolean, required: true, default: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true }, // lowercase: true
    password: { type: String, required: false },
    role: {
      user: { type: Boolean, required: true, default: true },
      admin: { type: Boolean, required: true, default: false },
    },
    personalInfo: {
      phone: { type: String, required: false },
      address: { type: String, required: false },
      avatar: { type: String, required: false },
      age: { type: String, required: false },
      about: { type: String, required: false },
      languages: [],
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: false,
      },
    ],
    stage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Stage",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Teacher = mongoose.model("Teacher", teacherSchema);

export default Teacher;
