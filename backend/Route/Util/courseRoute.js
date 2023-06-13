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

    try {
      const course = await Course.find()
        .skip(page * limit)
        .limit(limit);

      return res.status(200).send(course);
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
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
    try {
      const course = await Course.findById(req.params.id).populate("phases");
      return course
        ? res.status(200).send(course)
        : res.status(404).send({ message: "Not Found" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
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
    try {
      const phase = await Phase.findById(req.params.id).populate({
        path: "lesson",
        populate: {
          path: "homework",
          model: "Homework",
        },
      });

      return phase
        ? res.status(200).send(phase)
        : res.status(404).send({ message: "Not Found" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
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
    try {
      const lesson = await Lesson.findById(req.params.id);

      return lesson
        ? res.status(200).send(lesson)
        : res.status(404).send({ message: "Not Found" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
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
    try {
      const homework = await Homework.findById(req.params.id);
      return homework
        ? res.status(200).send(homework)
        : res.status(404).send({ message: "Not Found" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
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
    try {
      const exam = await Exam.findById(req.params.id);

      return exam
        ? res.status(200).send(exam)
        : res.status(404).send({ message: "Not Found" });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
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
    try {
      const courseExists = await Course.findOne({
        title: req.body.title,
      });

      if (courseExists)
        return res.status(409).send({ message: "Course already exist" });

      const course = await new Course({ ...req.body }).save();

      // if (req.body.teacher) {
      //   const teacher = await Teacher.updateOne(
      //     { _id: course.teacher },
      //     { $push: { courses: course._id } }
      //   );
      // } else {
      //   const company = await Company.updateOne(
      //     { _id: course.company },
      //     { $push: { courses: course._id } }
      //   );
      // }

      if (req.body.teacher) {
        await Teacher.findByIdAndUpdate(course.teacher, {
          $push: { courses: course._id },
        });
      } else {
        await Company.findByIdAndUpdate(course.company, {
          $push: { courses: course._id },
        });
      }

      return res
        .status(201)
        .send({ error: false, message: "Course created", course });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
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

    try {
      const phaseExists = await Phase.findOne({
        phaseTitle: req.body.phaseTitle,
      });

      if (phaseExists)
        return res.status(409).send({ message: "Phase already exist" });

      const phase = await new Phase({ ...req.body }).save();

      // const course = await Course.updateOne(
      //   { _id: phase.courseId },
      //   { $push: { phases: phase._id } }
      // );

      const course = await Course.findByIdAndUpdate(phase.courseId, {
        $push: { phases: phase._id },
      });

      return res
        .status(201)
        .send({ error: false, message: "Phase created", phase });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
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

    try {
      const lessonExists = await Lesson.findOne({
        lessonTitle: req.body.lessonTitle,
      });

      if (lessonExists)
        return res.status(409).send({ message: "Lesson already exists" });

      const lesson = await Lesson.create({ ...req.body });

      // const phase = await Phase.updateOne(
      //   { _id: lesson.phase },
      //   { $push: { lesson: lesson._id } }
      // );

      await Phase.findByIdAndUpdate(lesson.phase, {
        $push: { lesson: lesson._id },
      });

      return res
        .status(201)
        .send({ error: false, message: "Lesson created", lesson });
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

    try {
      const homework = await new Homework({ ...req.body }).save();

      // const lesson = await Lesson.updateOne(
      //   { _id: homework.lesson },
      //   { $push: { homework: homework._id } }
      // );
      const lesson = await Lesson.findByIdAndUpdate(homework.lesson, {
        $push: { homework: homework._id },
      });

      return res
        .status(201)
        .send({ error: false, message: "Homework created", homework });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
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
    try {
      const exam = await new Exam({ ...req.body }).save();

      // const phase = await Phase.updateOne(
      //   { _id: exam.phase },
      //   { $push: { finalExam: exam._id } }
      // );
      const phase = await Phase.findByIdAndUpdate(exam.phase, {
        $push: { finalExam: exam._id },
      });

      return res
        .status(201)
        .send({ error: false, message: "Exam created", exam });
    } catch (error) {
      console.error(error);
      res.status(500).send({ error: true, message: "Internal server error" });
    }
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
    if (error) {
      const errorMessage = error.details[0].message;
      return res.status(400).send({ error: true, message: errorMessage });
    }

    try {
      const course = await Course.findOne({ _id: req.params.id });

      const student = await Student.findOne({ _id: req.body.studentId });

      // Uncomment the following block if missing student should result in a 404 response
      // if (!student) {
      //   return res.status(404).send({ message: "Please login first" });
      // }

      if (course.stage > student.stage) {
        return res.status(200).send({ message: "Your stage is lower" });
      }

      if (student.name !== req.body.name || student.email !== req.body.email) {
        return res.status(400).send({
          message: "Your vitals do not match",
        });
      } else {
        const newPending = await new Pending({
          studentId: req.body.studentId,
          name: req.body.name,
          email: req.body.email,
          phone: req.body.phone,
          courseId: req.params.id,
        }).save();
        return res.status(201).send({
          message: `Your request to subscribe to ${course.title} has been sent`,
        });
      }
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .send({ error: true, message: "Internal server error" });
    }
  })
);

courseRouter.get("/byCategory/:category", async (req, res) => {
  try {
    const category = req.params.category;

    if (!category) return res.send([]);

    const courses = await Course.find({ courseCategory: category });

    return res.status(200).send(courses);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
});

courseRouter.get("/byStage/:stage", async (req, res) => {
  try {
    const stage = req.params.stage;

    if (!stage) return res.status(400).send([]);

    const courses = await Course.find({
      courseStage: stage,
    });

    return res.status(200).send(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, message: "Internal server error" });
  }
});

courseRouter.get("/byRaiting/:rating", async (req, res) => {
  try {
    const rating = Number(req.params.rating) || 0;

    const courses = await Course.find({
      rating: { $gte: rating },
    });

    return res.status(200).send(courses);
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, message: "Internal server error" });
  }
});

export default courseRouter;
