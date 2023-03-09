import express from "express";
import ItemsModel from "./model.js";
import createHttpError from "http-errors";

const itemsRouter = express.Router();

itemsRouter.post("/", async (req, res, next) => {
  try {
    const newItem = new ItemsModel(req.body);
    const { _id } = await newItem.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

itemsRouter.get("/", async (req, res, next) => {
  try {
    const items = await ItemsModel.find();
    res.send(items);
  } catch (error) {
    next(error);
  }
});

itemsRouter.get("/:itemId", async (req, res, next) => {
  try {
    const item = await ItemsModel.find(req.params.itemId);
    if (item) res.send(item);
    else
      next(
        createHttpError(404, `Item with id: ${req.params.itemId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

export default itemsRouter;
