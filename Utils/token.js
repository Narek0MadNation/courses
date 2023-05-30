import jwt from "jsonwebtoken";
import UserToken from "../Model/UserModel/userTokenModel.js";

export const generateToken = async (user) => {
  const access_token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  const refresh_token = jwt.sign({ _id: user._id }, process.env.JWT_REFRESH, {
    expiresIn: "30d", // 10m
  });

  const userToken = await UserToken.findOne({ userId: user._id });
  if (userToken) await userToken.deleteOne();

  const newtoken = await new UserToken({
    userId: user._id,
    token: refresh_token,
  }).save();
  // console.log("NEW", newtoken);
  return { access_token, refresh_token };
};

export const verifyRefreshToken = async (refreshToken) => {
  const token = await UserToken.findOne({ token: refreshToken });

  if (!token) throw { message: "Invalid Refresh Token" };

  const tokenDetails = jwt.verify(refreshToken, process.env.JWT_REFRESH);

  if (!tokenDetails) {
    throw { message: "Invalid Refresh Token" };
  }

  return {
    tokenDetails,
    message: "Valid refresh token",
  };
};
