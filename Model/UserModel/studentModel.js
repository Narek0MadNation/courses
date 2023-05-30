import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, default: "student" },
    isIndividual: { type: Boolean, required: true }, // default: true??
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: {
      user: { type: Boolean, required: true, default: true },
      admin: { type: Boolean, required: true, default: false },
    },
    avatar: { type: String, required: false },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    age: { type: String, required: false },
    languages: [],
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

const Student = mongoose.model("Student", studentSchema);

export default Student;
