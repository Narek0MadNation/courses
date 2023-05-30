import bcrypt from "bcryptjs";
import Admin from "../Model/CompanyModel/adminModel.js";
import Company from "../Model/CompanyModel/companyModel.js";
import Student from "../Model/userModel/studentModel.js";
import Teacher from "../Model/userModel/teacherModel.js";
import { generateToken } from "./token.js";
import SocialTeacher from "../Model/UserSocialModel/teacherModel.js";
import SocialStudent from "../Model/UserSocialModel/studentModel.js";

export const checkPassword = async (reqPassword, user) => {
  if (bcrypt.compareSync(reqPassword, user.password)) {
    const { access_token, refresh_token } = await generateToken(user);
    return { access_token, refresh_token };
  }
};

export const getUser = async (email) => {
  const teacher = await Teacher.findOne({ email });
  if (teacher) {
    return teacher;
  }

  const student = await Student.findOne({ email });
  if (student) {
    return student;
  }

  const admin = await Admin.findOne({ email });
  const company = await Company.findOne({ email });
  if (admin.email === company.email) {
    return admin;
  }
};

export const getSocialUser = async (email) => {
  const teacher = await SocialTeacher.findOne({ email });
  if (teacher) {
    return teacher;
  }

  const student = await SocialStudent.findOne({ email });
  if (student) {
    return student;
  }
};

export const defineSocialUser = async (type) => {
  if (type === "teacher") {
    return SocialTeacher;
  }

  if (type === "student") {
    return SocialStudent;
  }
};
