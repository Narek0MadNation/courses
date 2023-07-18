import express from "express";
import authController from "../../Controller/authController.js";

export const loginRouter = express.Router();
export const registerRouter = express.Router();
const authControllerInstance = authController;

/**
 * @swagger
 * tags:
 *  name: Login/Register
 *  description: Login or Register Users/Company
 */

/**
 * @swagger
 *  /api/login:
 *    post:
 *      summary: Log in
 *      tags: [Login/Register]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/logins/Login"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Login"
 */

loginRouter.post("/", authControllerInstance.login);

export default loginRouter;

/**
 * @swagger
 *  /api/register:
 *    post:
 *      summary: Register User
 *      tags: [Login/Register]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/logins/Register"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/logins/Register"
 */

registerRouter.post("/", authControllerInstance.register);

/**
 * @swagger
 *  /api/register/company:
 *    post:
 *      summary: Register User
 *      tags: [Login/Register]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/logins/Register_Company"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/logins/Register_Company"
 */

registerRouter.post("/company", authControllerInstance.registerCompany);
