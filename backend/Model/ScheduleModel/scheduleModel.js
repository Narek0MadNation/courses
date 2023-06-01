import mongoose from "mongoose";

const scheduleSchema = new mongoose.Schema(
  {
    monday: [
      {
        time: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Time",
          required: true,
        },
        assignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Assignment",
          required: true,
        },
      },
      { _id: new mongoose.Types.ObjectId() },
    ],
    tuesday: [
      {
        time: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Time",
          required: true,
        },
        assignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Assignment",
          required: true,
        },
      },
    ],
    wednesday: [
      {
        time: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Time",
          required: true,
        },
        assignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Assignment",
          required: true,
        },
      },
    ],
    thursday: [
      {
        time: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Time",
          required: true,
        },
        assignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Assignment",
          required: true,
        },
      },
    ],
    friday: [
      {
        time: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Time",
          required: true,
        },
        assignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Assignment",
          required: true,
        },
      },
    ],
    saturday: [
      {
        time: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Time",
          required: true,
        },
        assignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Assignment",
          required: true,
        },
      },
    ],
    sunday: [
      {
        time: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Time",
          required: true,
        },
        assignment: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Schedule_Assignment",
          required: true,
        },
      },
    ],
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Schedule = mongoose.model("Schedule", scheduleSchema);

export default Schedule;
