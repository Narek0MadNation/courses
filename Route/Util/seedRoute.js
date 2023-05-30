import express from "express";
import data from "../../data.js";
import Stage from "../../Model/UtilsModel/stageModel.js";
import Category from "../../Model/UtilsModel/categoryModel.js";

const seedRouter = express.Router();

/**
 * @swagger
 * tags:
 *  name: SEED
 *  description: Get stages and categories
 */

seedRouter.get("/add", async (req, res) => {
  await Stage.deleteMany({});
  const createdStage = await Stage.insertMany(data.stages);

  await Category.deleteMany({});
  const createdCategory = await Category.insertMany(data.categories);

  res.send({
    createdStage,
    createdCategory,
  });
});

/**
 * @swagger
 *  /api/seed/get:
 *    get:
 *      summary: Returns stages and categories
 *      tags: [SEED]
 *      responses:
 *        200:
 *          description: Success
 *          contents:
 *            application/json:
 *              schema:
 *                $ref: "#/components/schemas/Course"
 */

seedRouter.get("/get", async (req, res) => {
  const stage = await Stage.find();
  const category = await Category.find();
  console.log("now");
  res.send({ stage, category });
});

export default seedRouter;
