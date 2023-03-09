import express from "express";
import createHttpError from "http-errors";
import StoresModel from "./model.js";

const storesRouter = express.Router();

storesRouter.post("/", async (req, res, next) => {
  try {
    const newStore = new StoresModel(req.body);
    const { _id } = await newStore.save();
    res.status(201).send(_id);
  } catch (error) {
    next(error);
  }
});

storesRouter.get("/", async (req, res, next) => {
  try {
    const stores = await StoresModel.find();
    res.send(stores);
  } catch (error) {
    next(error);
  }
});

storesRouter.get("/:storeId", async (req, res, next) => {
  try {
    const store = await StoresModel.findById(req.params.storeId);
    if (store) res.send(store);
    else
      next(
        createHttpError(404, `Store with id: ${req.params.storeId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

export default storesRouter;
