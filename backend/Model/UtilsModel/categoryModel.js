import { Schema, model } from "mongoose";

const categorySchema = new Schema(
  {
    categoryName: { type: String, required: true },
    categoryType: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Category = model("Category", categorySchema);

export default Category;
