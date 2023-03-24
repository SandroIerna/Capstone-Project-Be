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
    const store = await StoresModel.findById(req.params.storeId).populate({
      path: "owner",
    });
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
            createHttpError(403, "Only the owner of the store can modify it!")
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

storesRouter.put(
  "/:storeId/stock-add",
  JWTAuthMiddleware,
  ownerOnlyMiddleware,
  async (req, res, next) => {
    try {
      const store = await StoresModel.findById(req.params.storeId);
      if (store) {
        if (store.owner.toString() === req.user._id) {
          const updatedStore = await StoresModel.findByIdAndUpdate(
            req.params.storeId,
            { $push: { stock: [req.body] } },
            { new: true, runValidators: true }
          );
          res.send(updatedStore);
        }
      }
    } catch (error) {
      next(error);
    }
  }
);

storesRouter.post("/cart", JWTAuthMiddleware, async (req, res, next) => {
  // try {
  //   console.log(req.body);
  //   let queryBody = [];
  //   req.body.map((id) =>
  //     queryBody.push({
  //       "stock._id": id,
  //     })
  //   );
  //   const stores = await StoresModel.find({
  //     $and: queryBody,
  //     //  req.body.map((id) => {
  //     //   `"stock.itemId":"${id}"`;
  //     // }),
  //     // [
  //     //   // { "stock.itemId": "640f965b24070139840e68bd" },
  //     //   { "stock.itemId": "640f962524070139840e68ba" },
  //     // ],
  //   });
  //   res.send(stores);
  // } catch (error) {
  //   next(error);
  // }
  try {
    console.log(req.body);
    let queryBody = [];
    req.body.map((id) =>
      queryBody.push({
        "stock._id": id,
      })
    );
    const stores = await StoresModel.find({
      $and: queryBody,
    }).populate("stock");
    const storesWithCartTotal = stores.map((store) => {
      let cartTotal = 0;
      store.stock.map((item) => {
        if (req.body.includes(item._id.toString())) {
          cartTotal += item.price;
        }
      });
      return { ...store.toObject(), cartTotal };
    });
    const sortedStores = storesWithCartTotal.sort(
      (a, b) => a.cartTotal - b.cartTotal
    );
    res.send(sortedStores);
  } catch (error) {
    next(error);
  }
});

storesRouter.post("/test", JWTAuthMiddleware, async (req, res, next) => {
  try {
    console.log(req.body);
    let queryBody = [];
    req.body.map((id) =>
      queryBody.push({
        "stock._id": id,
      })
    );
    const stores = await StoresModel.find({
      $and: queryBody,
    }).populate("stock");
    const storesWithCartTotal = stores.map((store) => {
      let cartTotal = 0;
      store.stock.map((item) => {
        if (req.body.includes(item._id.toString())) {
          cartTotal += item.price;
        }
      });
      return { ...store.toObject(), cartTotal };
    });
    const sortedStores = storesWithCartTotal.sort(
      (a, b) => a.cartTotal - b.cartTotal
    );
    res.send(sortedStores);
  } catch (error) {
    next(error);
  }
});

export default storesRouter;
