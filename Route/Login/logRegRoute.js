import express from "express";
import expressAsyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import Student from "../../Model/userModel/studentModel.js";
import Teacher from "../../Model/userModel/teacherModel.js";
import Company from "../../Model/CompanyModel/companyModel.js";
import Admin from "../../Model/CompanyModel/adminModel.js";
import { checkPassword, getUser } from "../../Utils/log.js";
import {
  LoginValidate,
  RegisterCompanyValidate,
  RegisterValidate,
} from "../../Utils/joi.js";

export const loginRouter = express.Router();
export const registerRouter = express.Router();

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

loginRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { error } = LoginValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });

    const user = await getUser(req.body.email);

    if (user) {
      const tokens = await checkPassword(req.body.password, user);
      if (tokens) {
        res.cookie("jwt", tokens.refresh_token, {
          httpOnly: true,
          sameSite: "none",
          maxAge: 24 * 60 * 60 * 1000,
        });
        return res.status(200).send({ message: "Logged in", ...tokens });
      }
    }
    return res.status(401).send({ message: "Invalid email or password" });
  })
);

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

registerRouter.post(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { error } = RegisterValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const studentExists = await Student.findOne({ email: req.body.email });
    const teacherExists = await Teacher.findOne({ email: req.body.email });
    if (studentExists || teacherExists)
      return res.json({ message: "Email already exist" });
    const hashPassword = bcrypt.hashSync(req.body.password);
    if (req.body.type === "student") {
      await new Student({ ...req.body, password: hashPassword }).save();
    } else {
      await new Teacher({ ...req.body, password: hashPassword }).save();
    }
    res.status(201).send({ message: "Account created successfully" });
  })
);

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

registerRouter.post(
  "/company",
  expressAsyncHandler(async (req, res) => {
    const { error } = RegisterCompanyValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    const companyExists = await Company.findOne({ email: req.body.email });
    if (companyExists) return res.json({ message: "Email already exist" });
    const hashPassword = bcrypt.hashSync(req.body.password);

    const company = await Company({
      companyType: req.body.companyType,
      companyName: req.body.companyName,
      email: req.body.email,
    }).save();
    const admin = await Admin({
      adminType: req.body.adminType,
      name: req.body.name,
      email: req.body.email,
      password: hashPassword,
      company: company._id,
    }).save();
    const setAdmin = await company.updateOne({ admin: admin._id });
    res.status(201).send({ company, message: "Company created successfully" });
  })
);
