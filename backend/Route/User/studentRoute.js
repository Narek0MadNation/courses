import express from "express";
import expressAsyncHandler from "express-async-handler";
import { StudentProfileValidate } from "../../Utils/joi.js";
import Student from "../../Model/userModel/studentModel.js";
import Course from "../../Model/CourseModel/courseModel.js";
import Subscribe from "../../Model/SubscribeModel/subscribeModel.js";
import Schedule from "../../Model/ScheduleModel/scheduleModel.js";

const studentRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name: Student
 *  description: Student managing APIs
 */

/**
 * @swagger
 *  /api/student/{id}/profile:
 *    post:
 *      summary: Set or update profile
 *      tags: [Student]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Student id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Student"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Student"
 */

studentRouter.post(
  "/:id/profile",
  expressAsyncHandler(async (req, res) => {
    try {
      const { error } = StudentProfileValidate(req.body);
      if (error)
        return res
          .status(400)
          .send({ error: true, message: error.details[0].message });
      const profile = await Student.findOneAndUpdate(
        // { _id: req.body._id },
        { _id: req.params.id },
        { ...req.body }
      );
      res.status(201).send(profile);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal Server Error" });
    }
  })
);

/**
 * @swagger
 *  /api/student/{id}:
 *    get:
 *      summary: Get profile
 *      tags: [Student]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Student id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Student"
 */

studentRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await Student.findById(req.params.id);
      if (user) {
        return res.send(user);
      }
      return res.status(404).send({ message: "User not found" });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  })
);

/**
 * @swagger
 *  /api/student/{id}/subscriptions:
 *    get:
 *      summary: Get student subscriptions
 *      tags: [Student]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Student id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Course"
 */

studentRouter.get(
  "/:id/subscriptions",
  expressAsyncHandler(async (req, res) => {
    try {
      const subscriptions = await Subscribe.find({ studentId: req.params.id });
      if (subscriptions.length === 0)
        return res.status(404).send({ message: "No Subscriptions" }); // redirect
      const courseIds = subscriptions.map((item) => item.courseId);
      const courses = await Course.find({ _id: { $in: courseIds } });
      res.status(200).send(courses);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  })
);

/**
 * @swagger
 *  /api/student/{id}/unsubscribe:
 *    delete:
 *      summary: Delete subscription
 *      tags: [Student]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: Student id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/request/Delete_Subscribtion"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/request/Delete_Subscribtion"
 */

studentRouter.delete(
  "/:id/unsubscribe",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await Subscribe.findOne({ studentId: req.params.id });
      if (!user) return res.status(404).send({ message: "Please login" }); // redirect
      const course = await Course.findOne({ _id: req.body.courseId });
      if (!course) return res.status(404).send({ message: "Course not found" });
      const unsubscribe = await Subscribe.findOneAndDelete({
        courseId: req.body.courseId,
      });
      res.status(200).send({ message: `You unsubscribed ${course.title}` });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ error: true, message: "Internal Server Error" });
    }
  })
);

// studentRouter.get(
//   "/:id/schedule",
//   expressAsyncHandler(async (req, res) => {
//     const schedule = await Schedule.findOne({ teacher: req.params.id });
//     if (!schedule)
//       return res.status(404).send({ message: "No schedule's found" });
//     res.status(200).send(schedule);
//   })
// );

// studentRouter.put(
//   "/:id/schedule/assign/:day",
//   expressAsyncHandler(async (req, res) => {
//     const schedule = await Schedule.findOne(
//       { teacher: req.params.id },
//       { [req.params.day]: { $elemMatch: { _id: req.body._id } } }
//     );
//     const studentIDs = schedule[req.params.day][0].studentIDs;
//     const assign = studentIDs.push(req.body.studentIDs);

//     console.log("ID: ", schedule._id);
//     console.log("DAY: ", schedule[req.params.day]);
//     console.log("START: ", schedule[req.params.day][0].start);
//     console.log("END: ", schedule[req.params.day][0].end);
//     console.log("STUDENT IDS: ", assign);
//     console.log("OBJECT ID: ", schedule[req.params.day][0]._id);
//     res.status(201).send({ schedule, message: "Schedule created" });
//   })
// );

//???
studentRouter.get(
  "/chat/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select([
      "name",
      "email",
      "avatar",
      "_id",
    ]);
    if (!user) return res.status(404).send({ message: "User not found" });
    return res.send(user);
  })
);

export default studentRouter;
