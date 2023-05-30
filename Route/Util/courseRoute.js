import express from "express";
import expressAsyncHandler from "express-async-handler";
import {
  CourseCreateValidate,
  ExamCreateValidate,
  HomeworkCreateValidate,
  LessonCreateValidate,
  PhaseCreateValidate,
  SubscribeValidate,
} from "../../Utils/joi.js";
import Course from "../../Model/CourseModel/courseModel.js";
import Phase from "../../Model/CourseModel/phaseModel.js";
import Lesson from "../../Model/CourseModel/lessonModel.js";
import Homework from "../../Model/CourseModel/homeworkModel.js";
import Exam from "../../Model/CourseModel/examModel.js";
import { isAuth } from "../../Middleware/isAuth.js";
import Teacher from "../../Model/userModel/teacherModel.js";
import Student from "../../Model/userModel/studentModel.js";
import Pending from "../../Model/SubscribeModel/pendingModel.js";
import Company from "../../Model/CompanyModel/companyModel.js";

const courseRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name: Course
 *  description: Course managing APIs
 */

/**
 * @swagger
 *  /api/course:
 *    get:
 *      summary: Returns all courses
 *      tags: [Course]
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Course"
 */

courseRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const page = req.query.page || 0;
    const limit = 4;

    const course = await Course.find()
      .skip(page * limit)
      .limit(limit);
    res.send(course);
    return;
  })
);

/**
 * @swagger
 *  /api/course/{id}:
 *    get:
 *      summary: Returns course by id
 *      tags: [Course]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: course id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Course"
 */

courseRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const course = await Course.findById(req.params.id).populate("phases");
    course ? res.send(course) : res.status(404).send({ message: "Not Found" });
  })
);

/**
 * @swagger
 *  /api/course/phase/{id}:
 *    get:
 *      summary: Returns phases of the course
 *      tags: [Course]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: course id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Phase"
 */

courseRouter.get(
  "/phase/:id",
  expressAsyncHandler(async (req, res) => {
    const phase = await Phase.findById(req.params.id).populate({
      path: "lesson",
      populate: {
        path: "homework",
        model: "Homework",
      },
    });
    phase ? res.send(phase) : res.status(404).send({ message: "Not Found" });
  })
);

/**
 * @swagger
 *  /api/course/lesson/{id}:
 *    get:
 *      summary: Returns lessons of the course
 *      tags: [Course]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: course id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Lesson"
 */

courseRouter.get(
  "/lesson/:id",
  expressAsyncHandler(async (req, res) => {
    const lesson = await Lesson.findById(req.params.id);
    lesson ? res.send(lesson) : res.status(404).send({ message: "Not Found" });
  })
);

/**
 * @swagger
 *  /api/course/homework/{id}:
 *    get:
 *      summary: Returns homeworks of the lesson
 *      tags: [Course]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: course id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Homework"
 */

courseRouter.get(
  "/homework/:id",
  expressAsyncHandler(async (req, res) => {
    const homework = await Homework.findById(req.params.id);
    homework
      ? res.send(homework)
      : res.status(404).send({ message: "Not Found" });
  })
);

/**
 * @swagger
 *  /api/course/exam/{id}:
 *    get:
 *      summary: Returns exam of the course
 *      tags: [Course]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: course id
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Exam"
 */

courseRouter.get(
  "/exam/:id",
  expressAsyncHandler(async (req, res) => {
    const exam = await Exam.findById(req.params.id);
    exam ? res.send(exam) : res.status(404).send({ message: "Not Found" });
  })
);

/**
 * @swagger
 *  /api/course/create:
 *    post:
 *      summary: Create course
 *      tags: [Course]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Course"
 *      responses:
 *        201:
 *          description: Created
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Course"
 */

courseRouter.post(
  "/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { error } = CourseCreateValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const courseExists = await Course.findOne({
      title: req.body.title,
    });
    if (courseExists) return res.json({ message: "Course already exist" });
    const course = await new Course({ ...req.body }).save();
    if (req.body.teacher) {
      const teacher = await Teacher.updateOne(
        { _id: course.teacher },
        { $push: { courses: course._id } }
      );
    } else {
      const company = await Company.updateOne(
        { _id: course.company },
        { $push: { courses: course._id } }
      );
    }
    res.status(201).send({ error: false, message: "Course created", course });
  })
);

/**
 * @swagger
 *  /api/course/phase/create:
 *    post:
 *      summary: Create phase for the course
 *      tags: [Course]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Phase"
 *      responses:
 *        201:
 *          description: Created
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Phase"
 */

courseRouter.post(
  "/phase/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { error } = PhaseCreateValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const phaseExists = await Phase.findOne({
      phaseTitle: req.body.phaseTitle,
    });
    if (phaseExists) return res.json({ message: "Phase already exist" });
    const phase = await new Phase({ ...req.body }).save();
    const course = await Course.updateOne(
      { _id: phase.course },
      { $push: { phases: phase._id } }
    );
    res.status(201).send({ error: false, message: "Phase created", phase });
  })
);

/**
 * @swagger
 *  /api/course/lesson/create:
 *    post:
 *      summary: Create lesson for the phase
 *      tags: [Course]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Lesson"
 *      responses:
 *        201:
 *          description: Created
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Lesson"
 */

courseRouter.post(
  "/lesson/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { error } = LessonCreateValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const lessonExists = await Lesson.findOne({
      lessonTitle: req.body.lessonTitle,
    });
    if (lessonExists) return res.json({ message: "Lesson already exist" });
    const lesson = await new Lesson({ ...req.body }).save();
    const phase = await Phase.updateOne(
      { _id: lesson.phase },
      { $push: { lesson: lesson._id } }
    );
    res.status(201).send({ error: false, message: "Lesson created", lesson });
  })
);

/**
 * @swagger
 *  /api/course/homework/create:
 *    post:
 *      summary: Create homework for the lesson
 *      tags: [Course]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Homework"
 *      responses:
 *        201:
 *          description: Created
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Homework"
 */

courseRouter.post(
  "/homework/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { error } = HomeworkCreateValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const homework = await new Homework({ ...req.body }).save();
    const lesson = await Lesson.updateOne(
      { _id: homework.lesson },
      { $push: { homework: homework._id } }
    );
    res.status(201).send({
      error: false,
      message: "Homework created",
      homework,
    });
  })
);

/**
 * @swagger
 *  /api/course/exam/create:
 *    post:
 *      summary: Create exam for the phase
 *      tags: [Course]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Exam"
 *      responses:
 *        201:
 *          description: Created
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Exam"
 */

courseRouter.post(
  "/exam/create",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { error } = ExamCreateValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const exam = await new Exam({ ...req.body }).save();
    const phase = await Phase.updateOne(
      { _id: exam.phase },
      { $push: { finalExam: exam._id } }
    );
    res.status(201).send({
      error: false,
      message: "Exam created",
      exam,
    });
  })
);

/**
 * @swagger
 *  /api/course/{id}/subsribe:
 *    post:
 *      summary: Request subscribtion for a course
 *      tags: [Course]
 *      parameters:
 *        - in: path
 *          name: id
 *          schema:
 *            type: string
 *          required: true
 *          description: course id
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/schemas/Pending"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Pending"
 */

courseRouter.post(
  "/:id/subscribe",
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const { error } = SubscribeValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const course = await Course.findOne({ _id: req.params.id });
    const student = await Student.findOne({ _id: req.body.studentId });
    // if (!student)
    //   return res.status(404).send({ message: "Please login first" }); // redirect
    if (course.stage > student.stage) {
      return res.send({ message: "Your stage is lower" });
    }
    if (student.name !== req.body.name || student.email !== req.body.email) {
      res.status(400).send({
        message: `Your vitals do not match`,
      });
    } else {
      const newPending = await new Pending({
        studentId: req.body.studentId,
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        courseId: req.params.id,
      }).save();
      res.status(201).send({
        message: `Your request to subscribe to ${course.title} has been sent`,
      });
    }
  })
);

courseRouter.get("/byCategory/:category", async (req, res) => {
  const category = req.params.category;

  if (!category) {
    res.send([]);
    return;
  }

  const courses = await Course.find({
    courseCategory: category,
  });
  res.send(courses);
});

courseRouter.get("/byStage/:stage", async (req, res) => {
  const stage = req.params.stage;
  console.log(stage);

  if (!stage) {
    res.send([]);
    return;
  }

  const courses = await Course.find({
    courseStage: stage,
  });
  res.send(courses);
});

courseRouter.get("/byRaiting/:rating", async (req, res) => {
  const rating = Number(req.params.rating) || 0;

  const courses = await Course.find({
    rating: { $gte: rating },
  });
  res.send(courses);
});

export default courseRouter;
