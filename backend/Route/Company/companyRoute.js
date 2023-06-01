import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import { isAdmin } from "../../Middleware/isAdmin.js";
import Company from "../../Model/CompanyModel/companyModel.js";
import Company_Teacher from "../../Model/CompanyModel/companyTeacherModel.js";
import Course from "../../Model/CourseModel/courseModel.js";
import Subscribe from "../../Model/SubscribeModel/subscribeModel.js";
import {
  CompanyProfileValidate,
  CompanyTeacherValidate,
} from "../../Utils/joi.js";

const companyRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name: Company
 *  description: Company managing APIs
 */

/**
 * @swagger
 *  /api/company/{id}/profile:
 *    get:
 *      summary: Set or update profile
 *      tags: [Company]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Company id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Company"
 */

companyRouter.post(
  "/:id/profile",
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { error } = CompanyProfileValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const profile = await Company.findOneAndUpdate(
      // { _id: req.body._id },
      { _id: req.params.id },
      { ...req.body }
    );
    res.status(202).send({ profile, message: "Profile updated" });
  })
);

/**
 * @swagger
 *  /api/company/{id}/create_teacher:
 *    post:
 *      summary: Create Company teacher
 *      tags: [Company]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Company id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Company_Teacher"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Company_Teacher"
 */

companyRouter.post(
  "/:id/create_teacher",
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const { error } = CompanyTeacherValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const teacherExists = await Company_Teacher.findOne({
      email: req.body.email,
    });
    if (teacherExists) return res.json({ message: "Teacher already exist" });
    const teacher = await new Company_Teacher({
      ...req.body,
      company: req.params.id,
    }).save();
    const company = await Company.updateOne(
      { _id: teacher.company },
      { $push: { teachers: teacher._id } }
    );
    console.log(teacher);
    res.status(201).send({ error: false, message: "Teacher created" });
  })
);

/**
 * @swagger
 *  /api/company/{id}:
 *    get:
 *      summary: Get company by id
 *      tags: [Company]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Company id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Company"
 */

companyRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id);
    company
      ? res.send(company)
      : res.status(404).send({ message: "Company not found" });
  })
);

/**
 * @swagger
 *  /api/company/{id}/course:
 *    get:
 *      summary: Get company courses by company id
 *      tags: [Company]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Company id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Course"
 */

companyRouter.get(
  "/:id/course",
  expressAsyncHandler(async (req, res) => {
    const page = req.query.page || 0;
    const limit = 4;

    const course = await Course.find({ company: req.params.id })
      .skip(page * limit)
      .limit(limit);
    res.status(200).send(course);
    return;
  })
);

/**
 * @swagger
 *  /api/company/{id}/course/assign_teacher:
 *    post:
 *      summary: Assign teacher id to company course
 *      tags: [Company]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Company id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/request/Company_Assign_Teacher"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/request/Company_Assign_Teacher"
 */

companyRouter.post(
  "/:id/course/assign_teacher",
  expressAsyncHandler(async (req, res) => {
    const course = await Course.findOneAndUpdate(
      { _id: req.body._id },
      { teacher: req.body.teacher }
    );
    res.status(200).send(course);
  })
);

/**
 * @swagger
 *  /api/company/{id}/students:
 *    get:
 *      summary: Get company students
 *      tags: [Company]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Company id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Company"
 */

companyRouter.get(
  "/:id/students",
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id).populate("students");
    res.status(200).send(company.students);
  })
);

/**
 * @swagger
 *  /api/company/{id}/teachers:
 *    get:
 *      summary: Get company teachers
 *      tags: [Company]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Company id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Company"
 */

companyRouter.get(
  "/:id/teachers",
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id).populate("teachers");
    res.status(200).send(company.teachers);
  })
);

/**
 * @swagger
 *  /api/company/{id}/courses:
 *    get:
 *      summary: Get company courses
 *      tags: [Company]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Company id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Company"
 */

companyRouter.get(
  "/:id/courses",
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const company = await Company.findById(req.params.id).populate("courses");
    console.log(company);
    res.status(200).send(company.courses);
  })
);

// companyRouter.get(
//   "/:id/schedule",
//   expressAsyncHandler(async (req, res) => {
// const schedule = await Schedule.findOne({ teacher: req.params.id });
// if (!schedule) {
//   const schedule = await new Schedule({
//     ...req.body,
//     teacher: req.params.id,
//   }).save();
//   return res.status(200).send(schedule);
// }
// res.status(200).send(schedule);
//   })
// );

// companyRouter.post(
//   "/:id/schedule/create",
//   expressAsyncHandler(async (req, res) => {
//     const scheduleExists = await Schedule.findOne({ teacher: req.params.id });
//     if (scheduleExists) return res.send(scheduleExists);
//     console.log("SCHEDULE CREATED");
//     res.status(201).send({ schedule, message: "Schedule created" });
//   })
// );

// companyRouter.post(
//   "/:id/schedule/assign",
//   expressAsyncHandler(async (req, res) => {
// const schedule = await Schedule.findOne({ teacher: req.params.id });
// if (schedule) {
//   const time = [...req.body];
//   const insert = await Schedule_Time.insertMany(time);
//   res.status(201).send(insert);
// }
//   })
// );

// companyRouter.post(
//   "/:id/schedule/:day",
// expressAsyncHandler(async (req, res) => {
// const schedule = await Schedule.updateOne(
//   { teacher: req.params.id },
//   { $push: { [req.params.day]: { ...req.body } } }
// );
// res.status(201).send({ schedule, message: "Schedule created" });
//   })
// );

export default companyRouter;
