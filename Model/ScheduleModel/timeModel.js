import mongoose from "mongoose";

const timeSchema = new mongoose.Schema({
  start: { type: Number, required: true },
  end: { type: Number, required: true },
  schedule: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Schedule",
    required: true,
  },
});

const Schedule_Time = mongoose.model("Schedule_Time", timeSchema);

export default Schedule_Time;
