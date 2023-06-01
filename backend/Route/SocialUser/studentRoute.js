import express from "express";
import expressAsyncHandler from "express-async-handler";
import { StudentProfileValidate } from "../../Utils/joi.js";
import SocialStudent from "../../Model/UserSocialModel/studentModel.js";
import Course from "../../Model/CourseModel/courseModel.js";
import Subscribe from "../../Model/SubscribeModel/subscribeModel.js";
import Schedule from "../../Model/ScheduleModel/scheduleModel.js";

const socialStudentRouter = express.Router();

socialStudentRouter.post(
  "/:id/profile",
  expressAsyncHandler(async (req, res) => {
    const { error } = StudentProfileValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const profile = await SocialStudent.findOneAndUpdate(
      // { _id: req.body._id },
      { _id: req.params.id },
      { ...req.body }
    );
    res.status(201).send(profile);
  })
);

socialStudentRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await SocialStudent.findById(req.params.id);
    user ? res.send(user) : res.status(404).send({ message: "User not found" });
  })
);

socialStudentRouter.get(
  "/:id/subscriptions",
  expressAsyncHandler(async (req, res) => {
    const user = await Subscribe.find({ studentId: req.params.id });
    if (!user) return res.status(404).send({ message: "No Subscriptions" }); // redirect
    const courseId = user.map((item) => item.courseId);
    const course = await Course.find({ _id: courseId });
    res.status(200).send(course);
  })
);

socialStudentRouter.delete(
  "/:id/unsubscribe",
  expressAsyncHandler(async (req, res) => {
    const user = await Subscribe.findOne({ studentId: req.params.id });
    if (!user) return res.status(404).send({ message: "Please login" }); // redirect
    const course = await Course.findOne({ _id: req.body.courseId });
    const unsubscribe = await Subscribe.findOneAndDelete({
      courseId: req.body.courseId,
    });
    res.status(200).send({ message: `You unsubscribed ${course.title}` });
  })
);

// socialStudentRouter.get(
//   "/:id/schedule",
//   expressAsyncHandler(async (req, res) => {
//     const schedule = await Schedule.findOne({ teacher: req.params.id });
//     if (!schedule)
//       return res.status(404).send({ message: "No schedule's found" });
//     res.status(200).send(schedule);
//   })
// );

socialStudentRouter.put(
  "/:id/schedule/assign/:day",
  expressAsyncHandler(async (req, res) => {
    const schedule = await Schedule.findOne(
      { teacher: req.params.id },
      { [req.params.day]: { $elemMatch: { _id: req.body._id } } }
    );
    const studentIDs = schedule[req.params.day][0].studentIDs;
    const assign = studentIDs.push(req.body.studentIDs);

    console.log("ID: ", schedule._id);
    console.log("DAY: ", schedule[req.params.day]);
    console.log("START: ", schedule[req.params.day][0].start);
    console.log("END: ", schedule[req.params.day][0].end);
    console.log("STUDENT IDS: ", assign);
    console.log("OBJECT ID: ", schedule[req.params.day][0]._id);
    res.status(201).send({ schedule, message: "Schedule created" });
  })
);

//???
socialStudentRouter.get(
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

export default socialStudentRouter;
