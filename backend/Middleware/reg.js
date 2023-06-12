import Student from "../Model/userModel/studentModel.js";
import Teacher from "../Model/userModel/teacherModel.js";
import SocialTeacher from "../Model/UserSocialModel/teacherModel.js";
import SocialStudent from "../Model/UserSocialModel/studentModel.js";

export const checkUser = async (email) => {
  const teacher = await Teacher.findOne({ email });
  if (teacher) return teacher;

  const student = await Student.findOne({ email });
  if (student) return student;
};

export const defineUser = async (type) => {
  if (type === "teacher") return Teacher;

  if (type === "student") return Student;
};
