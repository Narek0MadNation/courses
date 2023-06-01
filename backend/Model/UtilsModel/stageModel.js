import mongoose from "mongoose";

const stageSchema = new mongoose.Schema(
  {
    stageName: { type: String, required: true },
    stageType: { type: String, required: true },
    value: { type: Number, enum: [1, 2, 3, 4] },
  },
  {
    timestamps: true,
  }
);

const Stage = mongoose.model("Stage", stageSchema);

export default Stage;
