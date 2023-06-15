import express from "express";
import dotenv from "dotenv";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import passport from "passport";

import Connection from "./Utils/connection.js";
import { credentials } from "./Config/credentials.js";
import { corsOptions } from "./Config/corsOptions.js";

import swaggerUI from "swagger-ui-express";
import { specs } from "./Utils/swagger.js";

import seedRouter from "./Route/Util/seedRoute.js";

import { loginRouter, registerRouter } from "./Route/Login/logRegRoute.js";
import facebookRouter from "./Utils/facebook.js";
import googleRouter from "./Utils/google.js";
import tokenRouter from "./Route/Login/tokenRoute.js";

import studentRouter from "./Route/User/studentRoute.js";
import teacherRouter from "./Route/User/teacherRoute.js";
import socialStudentRouter from "./Route/SocialUser/studentRoute.js";
import socialTeacherRouter from "./Route/SocialUser/teacherRoute.js";

import companyRouter from "./Route/Company/companyRoute.js";
import company_Teacher_Router from "./Route/Company/company_Teacher_Route.js";

import courseRouter from "./Route/Util/courseRoute.js";
import subscribeRouter from "./Route/Util/subscribeRoute.js";

import messageRouter from "./Route/Util/messageRoute.js";

import { isAuth } from "./Middleware/isAuth.js";

dotenv.config();

Connection();

const app = express();

app.use(credentials);
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: "onlineCourseApp",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(
  "/api-docs",
  swaggerUI.serve,
  swaggerUI.setup(specs, { explorer: true })
);

app.use("/api/seed", seedRouter);

app.use("/api/login", loginRouter);
app.use("/api/register", registerRouter);
app.use("/api/facebook", facebookRouter);
app.use("/api/google", googleRouter);

app.use("/api/student", isAuth, studentRouter);
app.use("/api/teacher", isAuth, teacherRouter);
app.use("/api/socialStudent", isAuth, socialStudentRouter);
app.use("/api/socialTeacher", isAuth, socialTeacherRouter);

app.use("/api/refresh", tokenRouter);
app.use("/api/logout", tokenRouter);

app.use("/api/company", isAuth, companyRouter);
app.use("/api/company_teacher", isAuth, company_Teacher_Router);

app.use("/api/course", courseRouter);
app.use("/api/subscribe", isAuth, subscribeRouter);
app.use("/api/message", messageRouter);

app.use((err, req, res, next) => {
  res.status(404).send({ message: err.message });
});

const server = app.listen(process.env.PORT, () => {
  console.log(`SERVER RUNNING AT ${process.env.PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  console.log(`USER CONNECTED: ${socket.id}`);
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.Id);
  });

  //   socket.on("join_room", (data) => {
  //     socket.join(data);
  //     console.log(`USER WITH ID: ${socket.id} JOINED ROOM: ${data}`);
  //   });

  socket.on("send_message", (data) => {
    console.log(data);
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("receive_message", data.message);
    }
    // socket.to(data.room).emit("receive_message", data);
  });

  //   socket.on("disconnect", () => {
  //     console.log("USER DISCONNECTED", socket.id);
  //   });
});
