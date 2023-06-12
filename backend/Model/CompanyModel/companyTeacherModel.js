import mongoose from "mongoose";

const companyTeacherSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["teacher"],
      default: "teacher",
    },
    isIndividual: {
      type: Boolean,
      required: true,
      default: false,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: {
      type: String,
    },
    phone: {
      type: String,
    },
    age: {
      type: Number,
    },
    languages: {
      type: [String],
      default: [],
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
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

const Company_Teacher = mongoose.model("Company_Teacher", companyTeacherSchema);

export default Company_Teacher;
