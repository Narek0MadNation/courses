import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  if (req.originalUrl.includes("/api-docs")) {
    next();
  }

  const authorization = req.headers.authorization;
  if (!authorization) return res.status(404);
  // console.log(authorization);
  const token = authorization.split(" ")[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) return res.status(403);
    req.user = decode; // ?????
    next();
  });
};
