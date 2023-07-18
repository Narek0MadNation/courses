import expressAsyncHandler from "express-async-handler";
import Teacher from "../Model/UserModel/teacherModel.js";
import Course from "../Model/CourseModel/courseModel.js";
import Subscribe from "../Model/SubscribeModel/subscribeModel.js";
import Pending from "../Model/SubscribeModel/pendingModel.js";
import Schedule from "../Model/ScheduleModel/scheduleModel.js";
import { TeacherProfileValidate } from "../Utils/joi.js";

class TeacherController {
  constructor() {
    this.teacher = Teacher;
    this.course = Course;
    this.subscribe = Subscribe;
    this.pending = Pending;
    this.schedule = Schedule;
    this.profile = expressAsyncHandler(this.profile.bind(this));
    this.getId = expressAsyncHandler(this.getId.bind(this));
    this.getCourses = expressAsyncHandler(this.getCourses.bind(this));
    this.getSubscriptions = expressAsyncHandler(
      this.getSubscriptions.bind(this)
    );
    this.getPendings = expressAsyncHandler(this.getPendings.bind(this));
    this.approvePending = expressAsyncHandler(this.approvePending.bind(this));
    this.getSchedule = expressAsyncHandler(this.getSchedule.bind(this));
    // this.createSchedule = expressAsyncHandler(this.createSchedule.bind(this));
    this.assignSchedule = expressAsyncHandler(this.assignSchedule.bind(this));
    this.getDayInSchedule = expressAsyncHandler(
      this.getDayInSchedule.bind(this)
    );
    this.chat = expressAsyncHandler(this.chat.bind(this));
  }

  profile = async (req, res) => {
    try {
      const { error } = TeacherProfileValidate(req.body);
      if (error) {
        return res.status(400).send({
          error: true,
          message: error.details[0].message,
        });
      }
      const profile = await this.teacher.findOneAndUpdate(
        { _id: req.params.id },
        { ...req.body }
      );
      res.status(202).send({ profile, message: "Profile updated" });
    } catch (error) {
      console.error(error);
      return res.status(500).send({
        error: true,
        message: "Internal server error",
      });
    }
  };

  getId = async (req, res) => {
    try {
      const user = await this.teacher.findById(req.params.id);
      if (!user) return res.status(404).send({ message: "User not found" });
      res.send(user);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal server error" });
    }
  };

  getCourses = async (req, res) => {
    const page = req.query.page || 0;
    const limit = 4;

    try {
      const course = await this.course
        .find({ teacher: req.params.id })
        .skip(page * limit)
        .limit(limit);
      res.status(200).send(course);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal server error" });
    }
  };

  getSubscriptions = async (req, res) => {
    try {
      const course = await this.course.find({ teacher: req.params.id });
      const clourseIds = course.map((course) => course._id);
      const subscribtions = await this.subscribe.find({
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
  };

  getPendings = async (req, res) => {
    try {
      const course = await this.course.find({ teacher: req.params.id });
      const courseIds = course.map((course) => course._id);
      const pendings = await this.pending.find({
        courseId: { $in: courseIds },
      });

      if (pendings.length === 0)
        return res.status(404).send({ message: "No pending requests yet" });

      res.status(200).send(pendings);
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal server error" });
    }
  };

  approvePending = async (req, res) => {
    try {
      const pending = await this.pending.findById(req.body._id);
      if (!pending)
        return res.status(404).send({ message: "Pending request not found" });

      const subscription = new this.subscribe({
        studentId: pending.studentId,
        name: pending.name,
        email: pending.email,
        phone: pending.phone,
        courseId: pending.courseId,
        subscribedAt: pending.requestedAt,
      });

      await subscription.save();
      await this.pending.findByIdAndDelete(req.body._id);

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
  };

  getSchedule = async (req, res) => {
    const schedule = await this.schedule.findOne({ teacher: req.params.id });
    if (!schedule) {
      const schedule = await new this.schedule({
        ...req.body,
        teacher: req.params.id,
      }).save();
      return res.status(200).send(schedule);
    }
    res.status(200).send(schedule);
  };

  //   createSchedule = async (req, res) => {
  //     const scheduleExists = await this.schedule.findOne({
  //       teacher: req.params.id,
  //     });
  //     if (scheduleExists) return res.send(scheduleExists);
  //     console.log("SCHEDULE CREATED");
  //     res.status(201).send({ schedule, message: "Schedule created" });
  //   }

  assignSchedule = async (req, res) => {
    const schedule = await this.schedule.findOne({ teacher: req.params.id });
    if (schedule) {
      const time = [...req.body];
      const insert = await Schedule_Time.insertMany(time);
      res.status(201).send(insert);
    }
  };

  getDayInSchedule = async (req, res) => {
    const schedule = await this.schedule.updateOne(
      { teacher: req.params.id },
      { $push: { [req.params.day]: { ...req.body } } }
    );
    res.status(201).send({ schedule, message: "Schedule created" });
  };

  chat = async (req, res) => {
    const user = await this.teacher
      .findById(req.params.id)
      .select(["name", "email", "avatar", "_id"]);
    if (!user) return res.status(404).send({ message: "User not found" });
    return res.send(user);
  };
}

const teacherController = new TeacherController();

export default teacherController;
