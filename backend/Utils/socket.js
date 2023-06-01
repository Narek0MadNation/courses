// import { Server } from "socket.io";
// import http from "http";
// import { app } from "../server";

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//   },
// });

// io.on("connection", (socket) => {
//   console.log(`USER CONNECTED ${socket._id}`);

//   socket.on("join_room", (data) => {
//     console.log(data);
//   });

//   socket.on("send message", (data) => {
//     console.log(data);
//     socket.to(data.room).emit("receive message", data);
//   });
// });

// export default Socket;
