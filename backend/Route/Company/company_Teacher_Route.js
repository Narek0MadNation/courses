import express from "express";
import expressAsyncHandler from "express-async-handler";
import { TeacherProfileValidate } from "../../Utils/joi.js";
import Company_Teacher from "../../Model/CompanyModel/companyTeacherModel.js";
import Course from "../../Model/CourseModel/courseModel.js";
import Schedule from "../../Model/ScheduleModel/scheduleModel.js";
import Subscribe from "../../Model/SubscribeModel/subscribeModel.js";
import Pending from "../../Model/SubscribeModel/pendingModel.js";
import Schedule_Time from "../../Model/ScheduleModel/timeModel.js";
import Company from "../../Model/CompanyModel/companyModel.js";

const company_Teacher_Router = express.Router();

company_Teacher_Router.post(
  "/profile/:id",
  expressAsyncHandler(async (req, res) => {
    const { error } = TeacherProfileValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });

    try {
      const profile = await Company_Teacher.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body }
      );

      return res.status(202).send({ profile, message: "Profile updated" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  })
);

company_Teacher_Router.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    try {
      const user = await Company_Teacher.findById(req.params.id);

      user
        ? res.send(user)
        : res.status(404).send({ message: "User not found" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  })
);

company_Teacher_Router.get(
  "/:id/course",
  expressAsyncHandler(async (req, res) => {
    const page = req.query.page || 0;
    const limit = 4;

    try {
      const course = await Course.find({ teacher: req.params.id })
        .skip(page * limit)
        .limit(limit);

      return res.status(200).send(course);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  })
);

company_Teacher_Router.get(
  "/:id/students",
  expressAsyncHandler(async (req, res) => {
    try {
      const course = await Course.find({ teacher: req.params.id });
      const teacherCourseIds = course.map((course) => course._id);
      const subscribtions = await Subscribe.find({
        courseId: { $in: teacherCourseIds },
      });
      // !subscribtions.length
      if (subscribtions.length === 0)
        return res.status(404).send({ message: "No subscribtions yet" });

      return res.status(200).send(subscribtions);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  })
);

company_Teacher_Router.get(
  "/:id/pending",
  expressAsyncHandler(async (req, res) => {
    try {
      const course = await Course.find({ teacher: req.params.id });
      const courseIds = course.map((course) => course._id);
      const pendings = await Pending.find({ courseId: { $in: courseIds } });

      if (pendings.length === 0)
        return res.status(404).send({ message: "No pendings yet" });

      return res.status(200).send(pendings);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  })
);

company_Teacher_Router.post(
  "/:id/pending/approve",
  expressAsyncHandler(async (req, res) => {
    try {
      const pending = await Pending.findById(req.body._id);

      if (pending) {
        await new Subscribe({
          studentId: pending.studentId,
          name: pending.name,
          email: pending.email,
          phone: pending.phone,
          courseId: pending.courseId,
          subscribedAt: pending.requestedAt,
        }).save();
        pending.deleteOne();

        const company = await Company.findOneAndUpdate(
          { courses: pending.courseId },
          { $push: { students: pending.studentId } }
        );

        return res.status(200).send({ message: "Subscription approaved" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
  })
);

// company_Teacher_Router.get(
//   "/:id/schedule",
//   expressAsyncHandler(async (req, res) => {
//     const schedule = await Schedule.findOne({ teacher: req.params.id });
//     if (!schedule) {
//       const schedule = await new Schedule({
//         ...req.body,
//         teacher: req.params.id,
//       }).save();
//       return res.status(200).send(schedule);
//     }
//     res.status(200).send(schedule);
//   })
// );

// company_Teacher_Router.post(
//   "/:id/schedule/create",
//   expressAsyncHandler(async (req, res) => {
//     const scheduleExists = await Schedule.findOne({ teacher: req.params.id });
//     if (scheduleExists) return res.send(scheduleExists);
//     console.log("SCHEDULE CREATED");
//     res.status(201).send({ schedule, message: "Schedule created" });
//   })
// );

// company_Teacher_Router.post(
//   "/:id/schedule/assign",
//   expressAsyncHandler(async (req, res) => {
//     const schedule = await Schedule.findOne({ teacher: req.params.id });
//     if (schedule) {
//       const time = [...req.body];
//       const insert = await Schedule_Time.insertMany(time);
//       res.status(201).send(insert);
//     }
//   })
// );

// company_Teacher_Router.post(
//   "/:id/schedule/:day",
//   expressAsyncHandler(async (req, res) => {
//     const schedule = await Schedule.updateOne(
//       { teacher: req.params.id },
//       { $push: { [req.params.day]: { ...req.body } } }
//     );
//     res.status(201).send({ schedule, message: "Schedule created" });
//   })
// );

//???
company_Teacher_Router.get(
  "/chat/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await Company_Teacher.findById(req.params.id).select([
      "name",
      "email",
      "avatar",
      "_id",
    ]);
    if (!user) return res.status(404).send({ message: "User not found" });
    return res.send(user);
  })
);

export default company_Teacher_Router;
