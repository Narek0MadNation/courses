import Joi from "joi";
import passwordComplexity from "joi-password-complexity";

export const RegisterValidate = (body) => {
  const schema = Joi.object({
    type: Joi.string().required().label("Type"),
    isIndividual: Joi.boolean().required().label("Is Individual"),
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(body);
};

export const RegisterCompanyValidate = (body) => {
  const schema = Joi.object({
    companyType: Joi.string().required().label("Company Type"),
    companyName: Joi.string().required().label("Company Name"),
    adminType: Joi.string().required().label("Admin Type"),
    name: Joi.string().required().label("Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(body);
};

export const LoginValidate = (body) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
  });
  return schema.validate(body);
};

export const StudentProfileValidate = (body) => {
  const schema = Joi.object({
    // _id: Joi.string().required().label("ID"),
    name: Joi.string().label("Name"),
    avatar: Joi.string().label("Avatar"),
    phone: Joi.string().required().label("Phone"),
    address: Joi.string().required().label("Address"),
    age: Joi.string().required().label("Age"),
    languages: Joi.array().required().label("Languages"),
    stage: Joi.string().required().label("Stage"),
  });
  return schema.validate(body);
};

export const TeacherProfileValidate = (body) => {
  const schema = Joi.object({
    // _id: Joi.string().required().label("ID"),
    name: Joi.string().required().label("Name"),
    personalInfo: {
      phone: Joi.string().required().label("Phone"),
      address: Joi.string().required().label("Address"),
      age: Joi.string().required().label("Age"),
      about: Joi.string().required().label("About"),
      languages: Joi.array().required().label("Languages"),
    },
    stage: Joi.string().required().label("Stage"),
  });
  return schema.validate(body);
};

export const refreshTokenValidate = (body) => {
  const schema = Joi.object({
    refreshToken: Joi.string().required().label("Refresh Token"),
  });
  return schema.validate(body);
};

export const CreateCompanyValidate = (body) => {
  const schema = Joi.object({
    type: Joi.string().required().label("Type"),
    comapnyName: Joi.string().required().label("Company Name"),
    companyEmail: Joi.string().email().required().label("Comapny Email"),
    companyPassword: passwordComplexity().required().label("Password"),
  });
  return schema.validate(body);
};

export const CompanyProfileValidate = (body) => {
  const schema = Joi.object({
    companyName: Joi.string().label("Company Name"),
    companyInfo: {
      phone: Joi.string().required().label("Phone"),
      address: Joi.string().required().label("Address"),
      description: Joi.string().required().label("Description"),
      avatar: Joi.string().required().label("avatar"),
    },
    director: {
      name: Joi.string().required().label("Name"),
      phone: Joi.string().required().label("Phone"),
      address: Joi.string().required().label("Address"),
    },
  });
  return schema.validate(body);
};

export const CompanyTeacherValidate = (body) => {
  const schema = Joi.object({
    type: Joi.string().required().label("Type"),
    isIndividual: Joi.boolean().required().label("IsIndividual"),
    name: Joi.string().required().label("Name"),
    email: Joi.string().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    avatar: Joi.string().label("Avatar"),
    phone: Joi.string().required().label("Phone"),
    age: Joi.number().required().label("Age"),
    stage: Joi.string().required().label("Stage"),

    name: Joi.string().required().label("Name"),
    personalInfo: {
      phone: Joi.string().required().label("Phone"),
      address: Joi.string().required().label("Address"),
      age: Joi.string().required().label("Age"),
      about: Joi.string().required().label("About"),
      languages: Joi.array().required().label("Languages"),
    },
    stage: Joi.string().required().label("Stage"),
  });
  return schema.validate(body);
};

export const CourseCreateValidate = (body) => {
  const schema = Joi.object({
    title: Joi.string().required().label("Title"),
    // image: Joi.string().required().label("Image"),
    category: Joi.string().required().label("Category"),
    stage: Joi.string().required().label("Stage"),
    description: Joi.string().required().label("Description"),
    ageLimit: {
      min: Joi.number().required().label("Age Limit"),
      max: Joi.number().required().label("Age Limit"),
    },
    finalExam: Joi.boolean().required().label("Final Exam"),
    certificate: Joi.boolean().required().label("Certificate"),
    price: Joi.number().required().label("Price"),
    teacher: Joi.string().label("Teacher"),
    company: Joi.string().label("Company"),
  });
  return schema.validate(body);
};

export const PhaseCreateValidate = (body) => {
  const schema = Joi.object({
    phaseTitle: Joi.string().required().label("Phase Title"),
    course: Joi.string().required().label("Course"),
  });
  return schema.validate(body);
};

export const LessonCreateValidate = (body) => {
  const schema = Joi.object({
    lessonTitle: Joi.string().required().label("Lesson Title"),
    lessonTiming: Joi.number().required().label("Lesson Timing"),
    lessonLink: Joi.string().required().label("Link"),
    lessonDescription: Joi.string().required().label("Description"),
    additional: Joi.string().label("Additional"),
    lessonStatus: Joi.boolean().required().label("Status"),
    phase: Joi.string().required().label("Phase"),
    course: Joi.string().required().label("Course"),
  });
  return schema.validate(body);
};

export const HomeworkCreateValidate = (body) => {
  const schema = Joi.object({
    homeWorkVideo: Joi.string().required().label("Homework Video"),
    homeWorkDescription: Joi.string().required().label("Homework Description"),
    additional: Joi.string().label("Additional"),
    homeWorkStatus: Joi.boolean().required().label("Status"),
    lesson: Joi.string().required().label("Phase"),
    phase: Joi.string().required().label("Phase"),
    course: Joi.string().required().label("Course"),
  });
  return schema.validate(body);
};

export const ExamCreateValidate = (body) => {
  const schema = Joi.object({
    examTitle: Joi.string().required().label("Exam Title"),
    examDescription: Joi.string().required().label("Description"),
    examPassingValue: Joi.number().required().label("Passing Value"),
    examPassingTime: Joi.number().required().label("Passing Time"),
    additional: Joi.string().label("Additional"),
    examQuestion: Joi.array().required().label("Questions"),
    // answers: Joi.array().required().label("answers"),
    examStatus: Joi.boolean().required().label("Status"),
    phase: Joi.string().required().label("Phase"),
  });
  return schema.validate(body);
};

export const SubscribeValidate = (body) => {
  const schema = Joi.object({
    studentId: Joi.string().required().label("User ID"),
    name: Joi.string().required().label("Name"),
    email: Joi.string().required().label("Email"),
    phone: Joi.string().required().label("Phone"),
    // courseId: Joi.string().required().label("Course ID"),
  });
  return schema.validate(body);
};
