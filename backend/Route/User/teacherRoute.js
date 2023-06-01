import express from "express";
import expressAsyncHandler from "express-async-handler";
import { TeacherProfileValidate } from "../../Utils/joi.js";
import Teacher from "../../Model/userModel/teacherModel.js";
import Course from "../../Model/CourseModel/courseModel.js";
import Schedule from "../../Model/ScheduleModel/scheduleModel.js";
import Subscribe from "../../Model/SubscribeModel/subscribeModel.js";
import Pending from "../../Model/SubscribeModel/pendingModel.js";
import Schedule_Time from "../../Model/ScheduleModel/timeModel.js";

const teacherRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name: Teacher
 *  description: Teacher managing APIs
 */

/**
 * @swagger
 *  /api/student/{id}/profile:
 *    post:
 *      summary: Set or update profile
 *      tags: [Teacher]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Teacher id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Teacher"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Teacher"
 */

teacherRouter.post(
  "/profile/:id",
  expressAsyncHandler(async (req, res) => {
    const { error } = TeacherProfileValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const profile = await Teacher.findOneAndUpdate(
      // { _id: req.body._id },
      { _id: req.params.id },
      { ...req.body }
    );
    res.status(202).send({ profile, message: "Profile updated" });
  })
);

/**
 * @swagger
 *  /api/teacher/{id}:
 *    get:
 *      summary: Get profile
 *      tags: [Teacher]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Teacher id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Teacher"
 */

teacherRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await Teacher.findById(req.params.id);
    user ? res.send(user) : res.status(404).send({ message: "User not found" });
  })
);

/**
 * @swagger
 *  /api/teacher/{id}/course:
 *    get:
 *      summary: Get courses
 *      tags: [Teacher]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Teacher id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Courses"
 */

teacherRouter.get(
  "/:id/course",
  expressAsyncHandler(async (req, res) => {
    const page = req.query.page || 0;
    const limit = 4;

    const course = await Course.find({ teacher: req.params.id })
      .skip(page * limit)
      .limit(limit);
    res.send(course);
    return;
  })
);

/**
 * @swagger
 *  /api/teacher/{id}/subscribtions:
 *    get:
 *      summary: Get subscribtions
 *      tags: [Teacher]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Teacher id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Subscribe"
 */

teacherRouter.get(
  "/:id/subscribtions",
  expressAsyncHandler(async (req, res) => {
    const course = await Course.find({ teacher: req.params.id });
    const teacherCourse = course.map((el) => el._id);
    const subscribtions = await Subscribe.find({
      courseId: teacherCourse,
    });

    if (!subscribtions)
      return res.status(404).send({ message: "No subscribtions yet" });

    res.status(200).send(subscribtions);
  })
);

/**
 * @swagger
 *  /api/teacher/{id}/pending:
 *    get:
 *      summary: Get pendings
 *      tags: [Teacher]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Teacher id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Pending"
 */

teacherRouter.get(
  "/:id/pending",
  expressAsyncHandler(async (req, res) => {
    const course = await Course.find({ teacher: req.params.id });
    const teacherCourse = course.map((el) => el._id);
    const pendings = await Pending.find({ courseId: teacherCourse });

    if (!pendings) return res.status(404).send({ message: "No pendings yet" });

    res.status(200).send(pendings);
  })
);

/**
 * @swagger
 *  /api/student/{id}/pending/approve:
 *    post:
 *      summary: Approve pending
 *      tags: [Teacher]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Teacher id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/request/Approve_Pending"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Subscribe"
 */

teacherRouter.post(
  "/:id/pending/approve",
  expressAsyncHandler(async (req, res) => {
    const pending = await Pending.findById(req.body._id);
    if (pending) {
      await Subscribe({
        studentId: pending.studentId,
        name: pending.name,
        email: pending.email,
        phone: pending.phone,
        courseId: pending.courseId,
        subscribedAt: pending.requestedAt,
      }).save();
      pending.deleteOne();
      res.status(200).send({ message: `Subscription approaved` });
    }
  })
);

teacherRouter.get(
  "/:id/schedule",
  expressAsyncHandler(async (req, res) => {
    const schedule = await Schedule.findOne({ teacher: req.params.id });
    if (!schedule) {
      const schedule = await new Schedule({
        ...req.body,
        teacher: req.params.id,
      }).save();
      return res.status(200).send(schedule);
    }
    res.status(200).send(schedule);
  })
);

// teacherRouter.post(
//   "/:id/schedule/create",
//   expressAsyncHandler(async (req, res) => {
//     const scheduleExists = await Schedule.findOne({ teacher: req.params.id });
//     if (scheduleExists) return res.send(scheduleExists);
//     console.log("SCHEDULE CREATED");
//     res.status(201).send({ schedule, message: "Schedule created" });
//   })
// );

teacherRouter.post(
  "/:id/schedule/assign",
  expressAsyncHandler(async (req, res) => {
    const schedule = await Schedule.findOne({ teacher: req.params.id });
    if (schedule) {
      const time = [...req.body];
      const insert = await Schedule_Time.insertMany(time);
      res.status(201).send(insert);
    }
  })
);

teacherRouter.post(
  "/:id/schedule/:day",
  expressAsyncHandler(async (req, res) => {
    const schedule = await Schedule.updateOne(
      { teacher: req.params.id },
      { $push: { [req.params.day]: { ...req.body } } }
    );
    res.status(201).send({ schedule, message: "Schedule created" });
  })
);

//???
teacherRouter.get(
  "/chat/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await Teacher.findById(req.params.id).select([
      "name",
      "email",
      "avatar",
      "_id",
    ]);
    if (!user) return res.status(404).send({ message: "User not found" });
    return res.send(user);
  })
);

export default teacherRouter;
