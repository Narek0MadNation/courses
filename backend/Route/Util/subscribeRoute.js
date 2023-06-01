import express from "express";
import expressAsyncHandler from "express-async-handler";
import Subscribe from "../../Model/SubscribeModel/subscribeModel.js";
import Student from "../../Model/userModel/studentModel.js";
import Course from "../../Model/CourseModel/courseModel.js";
import { SubscribeValidate } from "../../Utils/joi.js";

const subscribeRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name: Subscribe
 *  description: Subscribtion managing APIs
 */

/**
 * @swagger
 *  /api/subscribe:
 *    post:
 *      summary: Subscribe
 *      tags: [Subscribe]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/request/Subscribe"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Pending"
 */

subscribeRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { error } = SubscribeValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const course = await Course.findOne({ _id: req.body.courseId });
    const user = await Student.findOne({ _id: req.body.userId });
    if (!user)
      return res.status(404).send({ message: "Please register first" }); // redirect
    if (course.courseStage > user.stage)
      return res.send({ message: "Your stage is lower" });
    // const subscription = await Subscribe.findOne({ userId: req.body.userId });
    const newSubscription = await new Subscribe({ ...req.body }).save();
    res
      .status(201)
      .send({ message: `You subscribed to ${course.courseTitle}` });
  })
);

export default subscribeRouter;
