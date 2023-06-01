import express from "express";
import expressAsyncHandler from "express-async-handler";
import Message from "../../Model/UtilsModel/messageModel.js";

const messageRouter = express.Router();

messageRouter.post(
  "/add",
  expressAsyncHandler(async (req, res) => {
    const { from, to, message } = req.body;
    const data = Message.create({
      message: { text: message },
      users: [from, to],
      sender: from,
    });
    if (data) return res.send({ message: "Message Added Succesfully" });
    return res.send({ message: "Failed to Add Message" });
  })
);

messageRouter.post(
  "/getAll",
  expressAsyncHandler(async (req, res) => {
    const { from, to } = req.body;
    const messages = await Message.find({ users: { $all: [from, to] } }).sort({
      updatedAt: 1,
    });
    const projectMessages = messages.map((msg) => {
      return {
        fromSelf: msg.sender.toString() === from,
        message: msg.message.text,
      };
    });
    res.send(projectMessages);
  })
);

export default messageRouter;
