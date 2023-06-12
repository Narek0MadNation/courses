import { Schema, model } from "mongoose";

const teacherSchema = new Schema(
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
      default: true,
    },
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: { type: String, default: "" },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    personalInfo: {
      phone: { type: String, default: "" },
      address: { type: String, default: "" },
      avatar: { type: String, default: "" },
      age: { type: String, required: false },
      about: { type: String, default: "" },
      languages: { type: [String], default: [] },
    },
    courses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
        required: false,
      },
    ],
    stage: {
      type: Schema.Types.ObjectId,
      ref: "Stage",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const SocialTeacher = model("SocialTeacher", teacherSchema);

export default SocialTeacher;
