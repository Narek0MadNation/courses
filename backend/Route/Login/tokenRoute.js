import express from "express";
import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import { refreshTokenValidate } from "../../Utils/joi.js";
import UserToken from "../../Model/UserModel/userTokenModel.js";
import { verifyRefreshToken } from "../../Utils/token.js";

const tokenRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name: Token
 *  description: Token managing APIs
 */

/**
 * @swagger
 *  /api/refresh:
 *    post:
 *      summary: Refresh token
 *      tags: [Token]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/request/Refresh_Token"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Refresh_Token"
 */

tokenRouter.post("/", async (req, res) => {
  const { error } = refreshTokenValidate(req.body);
  if (error)
    return res
      .status(400)
      .send({ error: true, message: error.details[0].message });

  try {
    const { tokenDetails } = await verifyRefreshToken(req.body.refreshToken);
    const access_token = jwt.sign(
      { _id: tokenDetails._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
    // res.clearCookie("jwt");
    // res.cookie("jwt", refresh_token, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   maxAge: 24 * 60 * 60 * 1000,
    // });
    res.status(200).send({
      access_token,
      message: "Access token created successfully",
    });
  } catch (error) {
    res.status(400).send(error);
  }
});

/**
 * @swagger
 *  /api/logout:
 *    delete:
 *      summary: Logout, delete token
 *      tags: [Token]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              $ref: "#/components/request/Logout"
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Refresh_Token"
 */

tokenRouter.delete(
  "/",
  expressAsyncHandler(async (req, res) => {
    const { error } = refreshTokenValidate(req.body);
    if (error)
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });

    const userToken = await UserToken.findOne({ token: req.body.refreshToken });
    if (!userToken)
      return res
        .status(200)
        .send({ error: false, message: "Log Out Successfully" });
    res.clearCookie("jwt");

    userToken.deleteOne();
    res.status(200).send({ error: false, message: "Log Out Successfully" });
  })
);

export default tokenRouter;
