import jwt from "jsonwebtoken";

export const isAuth = (req, res, next) => {
  if (req.originalUrl.includes("/api-docs")) {
    next();
  }

  const authorization = req.headers.authorization;
  if (!authorization) return res.status(404);

  const token = authorization.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ?????

    next();
  } catch (error) {
    console.error(error);
    return res.status(403).send({ message: "Invalid token" });
  }
};
