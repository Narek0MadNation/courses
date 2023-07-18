import express from "express";
import teacherController from "../../Controller/teacherController.js";

const teacherRouter = express.Router();
const teacherControllerInstance = teacherController;

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

teacherRouter.post("/:id/profile", teacherControllerInstance.profile);

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

teacherRouter.get("/:id", teacherControllerInstance.getId);

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

teacherRouter.get("/:id/course", teacherControllerInstance.getCourses);

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
  teacherControllerInstance.getSubscriptions
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

teacherRouter.get("/:id/pending", teacherControllerInstance.getPendings);

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
  teacherControllerInstance.approvePending
);

teacherRouter.get("/:id/schedule", teacherControllerInstance.getSchedule);

// teacherRouter.post("/:id/schedule/create", teacherControllerInstance.createSchedule);

teacherRouter.post(
  "/:id/schedule/assign",
  teacherControllerInstance.assignSchedule
);

teacherRouter.post(
  "/:id/schedule/:day",
  teacherControllerInstance.getDayInSchedule
);

//???
teacherRouter.get("/chat/:id", teacherControllerInstance.chat);

export default teacherRouter;
