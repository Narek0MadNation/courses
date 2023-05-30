import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: false,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: false,
  },
  time: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Time",
    required: true,
  },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
});

const Schedule_Assignment = mongoose.model(
  "Schedule_Assignment",
  assignmentSchema
);

export default Schedule_Assignment;
