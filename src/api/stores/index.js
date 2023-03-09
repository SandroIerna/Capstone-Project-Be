import express from "express";
import createHttpError from "http-errors";
import StoresModel from "./model.js";
import { JWTAuthMiddleware } from "../../library/jwtAuth.js";
import { ownerOnlyMiddleware } from "../../library/ownerOnly.js";

const storesRouter = express.Router();

storesRouter.post(
  "/",
  JWTAuthMiddleware,
  ownerOnlyMiddleware,
  async (req, res, next) => {
    try {
      const newStore = new StoresModel(req.body);
      const { _id } = await newStore.save();
      res.status(201).send(_id);
    } catch (error) {
      next(error);
    }
  }
);

storesRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const stores = await StoresModel.find();
    res.send(stores);
  } catch (error) {
    next(error);
  }
});

storesRouter.get("/:storeId", JWTAuthMiddleware, async (req, res, next) => {
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
