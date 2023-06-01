import { allowedOrigins } from "./allowedOrigins.js";

export const credentials = (req, res, next) => {
  const origin = req?.headers?.origin;
  if (allowedOrigins.includes(origin))
    return res.header("Access-Control-Allow-Credentials", true);
  next();
};
