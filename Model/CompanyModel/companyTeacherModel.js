import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, default: "teacher" },
    isIndividual: { type: Boolean, required: true, default: false },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: {
      user: { type: Boolean, required: true, default: true },
      admin: { type: Boolean, required: true, default: false },
    },
    avatar: { type: String, required: false },
    phone: { type: String, required: false },
    age: { type: Number, required: false },
    languages: [],
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
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
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Company_Teacher = mongoose.model("Company_Teacher", userSchema);

export default Company_Teacher;
