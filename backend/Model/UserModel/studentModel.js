import { Schema, model } from "mongoose";

const studentSchema = new Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["student"],
      default: "student",
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
      index: true,
    },
    password: { type: String, default: "" },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "user",
    },
    avatar: { type: String, default: "" },
    phone: { type: String, default: "" },
    address: { type: String, default: "" },
    age: { type: String, required: false },
    languages: { type: [String], default: [] },
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

const Student = model("Student", studentSchema);

export default Student;
