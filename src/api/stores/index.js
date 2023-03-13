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
      const newStore = new StoresModel({ ...req.body, owner: req.user._id });
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

storesRouter.put(
  "/:storeId",
  JWTAuthMiddleware,
  ownerOnlyMiddleware,
  async (req, res, next) => {
    try {
      const store = await StoresModel.findById(req.params.storeId);
      if (store) {
        if (store.owner.toString() === req.user._id) {
          const updatedStore = await StoresModel.findByIdAndUpdate(
            req.params.storeId,
            req.body,
            { new: true, runValidators: true }
          );
          res.send(updatedStore);
        } else {
          next(
            createHttpError(
              403,
              "Only and the owner of the store can modify it!"
            )
          );
        }
      } else
        next(
          createHttpError(404, `Store with id ${req.params.storeId} not found!`)
        );
    } catch (error) {
      next(error);
    }
  }
);

storesRouter.post("/cart", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const stores = await StoresModel.find({
      stock: {
        $all: [{ $elemMatch: { itemId: { $in: req.body.cart } } }],
      },
    });
    res.send(stores);
  } catch (error) {
    next(error);
  }
});

export default storesRouter;
