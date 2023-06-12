import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["admin"],
      default: "admin",
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
      required: false,
    },
    role: {
      type: String,
      required: true,
      enum: ["user", "admin"],
      default: "admin",
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
