import express from "express";
import expressAsyncHandler from "express-async-handler";
import { TeacherProfileValidate } from "../../Utils/joi.js";
import Teacher from "../../Model/UserModel/teacherModel.js";
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
 *  /api/teacher/{id}/profile:
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
  "/:id/profile",
  expressAsyncHandler(async (req, res) => {
    try {
      const { error } = TeacherProfileValidate(req.body);
      if (error)
        return res
          .status(400)
          .send({ error: true, message: error.details[0].message });
      const profile = await Teacher.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body }
      );
      res.status(202).send({ profile, message: "Profile updated" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal server error" });
    }
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
    try {
      const user = await Teacher.findById(req.params.id);
      if (!user) return res.status(404).send({ message: "User not found" });
      res.send(user);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal server error" });
    }
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

    try {
      const course = await Course.find({ teacher: req.params.id })
        .skip(page * limit)
        .limit(limit);
      res.status(200).send(course);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal server error" });
    }
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
    try {
      const course = await Course.find({ teacher: req.params.id });
      const clourseIds = course.map((course) => course._id);
      const subscribtions = await Subscribe.find({
        courseId: { $in: clourseIds },
      });

      if (subscribtions.length === 0)
        return res.status(404).send({ message: "No subscribtions yet" });

      res.status(200).send(subscribtions);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal server error" });
    }
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
    try {
      const course = await Course.find({ teacher: req.params.id });
      const courseIds = course.map((course) => course._id);
      const pendings = await Pending.find({ courseId: { $in: courseIds } });

      if (pendings.length === 0)
        return res.status(404).send({ message: "No pending requests yet" });

      res.status(200).send(pendings);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal server error" });
    }
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
    try {
      const pending = await Pending.findById(req.body._id);
      if (!pending)
        return res.status(404).send({ message: "Pending request not found" });

      const subscription = new Subscribe({
        studentId: pending.studentId,
        name: pending.name,
        email: pending.email,
        phone: pending.phone,
        courseId: pending.courseId,
        subscribedAt: pending.requestedAt,
      });

      await subscription.save();
      await Pending.findByIdAndDelete(req.body._id);

      res
        .status(200)
        .send({ message: "Pending request approved", subscription });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal server error" });
    }

    // const pending = await Pending.findById(req.body._id);
    // if (pending) {
    //   await Subscribe({
    //     studentId: pending.studentId,
    //     name: pending.name,
    //     email: pending.email,
    //     phone: pending.phone,
    //     courseId: pending.courseId,
    //     subscribedAt: pending.requestedAt,
    //   }).save();
    //   pending.deleteOne();
    //   res.status(200).send({ message: `Subscription approaved` });
    // }
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
