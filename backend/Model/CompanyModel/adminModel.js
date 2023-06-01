import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    type: { type: String, required: true, default: "admin" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: {
      user: { type: Boolean, required: true, default: false },
      admin: { type: Boolean, required: true, default: true },
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Admin = mongoose.model("Admin", userSchema);

export default Admin;
