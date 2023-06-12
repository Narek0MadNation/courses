import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ["company"],
      default: "company",
    },
    companyName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    companyInfo: {
      phone: { type: String },
      address: { type: String },
      description: { type: String },
      avatar: { type: String },
    },
    director: {
      name: { type: String },
      phone: { type: String },
      address: { type: String },
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company_Teacher",
      },
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

export default Company;
