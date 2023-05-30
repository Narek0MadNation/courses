import mongoose from "mongoose";

const companySchema = new mongoose.Schema(
  {
    type: { type: String, required: true, default: "company" },
    companyName: { type: String, required: true },
    email: { type: String, required: true },
    // password: { type: String, required: true },
    companyInfo: {
      phone: { type: String, required: false },
      address: { type: String, required: false },
      description: { type: String, required: false },
      avatar: { type: String, required: false },
    },
    director: {
      name: { type: String, required: false },
      phone: { type: String, required: false },
      address: { type: String, required: false },
    },
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      required: false,
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: false,
      },
    ],
    teachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company_Teacher",
        required: false,
      },
    ],
    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: false,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Company = mongoose.model("Company", companySchema);

export default Company;
