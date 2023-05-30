import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    type: { type: String, default: "student" }, // required: true,
    isIndividual: { type: Boolean }, // default: true??, required: true
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
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

const SocialStudent = mongoose.model("SocialStudent", studentSchema);

export default SocialStudent;
