import express from "express";
import ItemsModel from "./model.js";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../../library/jwtAuth.js";
import { ownerOnlyMiddleware } from "../../library/ownerOnly.js";

const itemsRouter = express.Router();

itemsRouter.post(
  "/",
  JWTAuthMiddleware,
  ownerOnlyMiddleware,
  async (req, res, next) => {
    try {
      const itemCheck = await ItemsModel.findOne({ name: req.body.name });
      if (itemCheck) {
        next(
          createHttpError(
            400,
            `Item with name ${req.body.name} already exists!`
          )
        );
      } else {
        const newItem = new ItemsModel(req.body);
        const { _id } = await newItem.save();
        res.status(201).send({ _id });
      }
    } catch (error) {
      next(error);
    }
  }
);
itemsRouter.post("/items", async (req, res, next) => {
  try {
    const items = await ItemsModel.find({ name: { $regex: req.body.query } })
      .sort({ name: 1 })
      .collation({ locale: "en", caseLevel: true });
    res.send(items);
  } catch (error) {
    next(error);
  }
});

itemsRouter.get("/", async (req, res, next) => {
  try {
    const items = await ItemsModel.find()
      .sort({ name: 1 })
      .collation({ locale: "en", caseLevel: true });
    res.send(items);
  } catch (error) {
    next(error);
  }
});

itemsRouter.get("/:itemId", async (req, res, next) => {
  try {
    const item = await ItemsModel.findById(req.params.itemId);
    if (item) res.send(item);
    else
      next(
        createHttpError(404, `Item with id: ${req.params.itemId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

itemsRouter.get("/type/:itemsType", async (req, res, next) => {
  try {
    const items = await ItemsModel.find({ type: req.params.itemsType })
      .sort({ name: 1 })
      .collation({ locale: "en", caseLevel: true });
    res.send(items);
  } catch (error) {
    next(error);
  }
});

export default itemsRouter;
