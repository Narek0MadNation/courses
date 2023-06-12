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
  try {
    const { error } = refreshTokenValidate(req.body);
    if (error) {
      return res
        .status(400)
        .send({ error: true, message: error.details[0].message });
    }

    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .send({ error: true, message: "Refresh token is required" });
    }

    const { tokenDetails } = await verifyRefreshToken(refreshToken);

    const access_token = jwt.sign(
      { _id: tokenDetails._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );

    res.clearCookie("jwt");

    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).send({
      access_token,
      message: "Access token created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ error: true, message: "Internal server error" });
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

tokenRouter.delete("/", async (req, res) => {
  const { error } = refreshTokenValidate(req.body);
  if (error) {
    return res
      .status(400)
      .send({ error: true, message: error.details[0].message });
  }

  try {
    const userToken = await UserToken.findOne({ token: req.body.refreshToken });

    if (!userToken) {
      return res
        .status(404)
        .send({ error: true, message: "Invalid token or already logged out" });
    }

    res.clearCookie("jwt");
    await userToken.deleteOne();

    return res
      .status(200)
      .send({ error: false, message: "Logged out successfully" });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send({ error: true, message: "Internal server error" });
  }
});

export default tokenRouter;
