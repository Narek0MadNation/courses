import { Schema, model } from "mongoose";

const stageSchema = new Schema(
  {
    stageName: { type: String, required: true },
    stageType: { type: String, required: true },
    value: { type: Number, enum: [1, 2, 3, 4] },
  },
  {
    timestamps: true,
  }
);

const Stage = model("Stage", stageSchema);

export default Stage;
