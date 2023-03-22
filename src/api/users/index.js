import express from "express";
import createHttpError from "http-errors";
import { JWTAuthMiddleware } from "../../library/jwtAuth.js";
import { createAccessToken } from "../../library/tools.js";
import UsersModel from "./model.js";

const usersRouter = express.Router();

usersRouter.post("/register", async (req, res, next) => {
  try {
    const newUser = new UsersModel(req.body);
    const { _id } = await newUser.save();
    const payload = {
      _id: newUser._id,
      firstName: newUser.firstName,
      role: newUser.role,
    };
    const accessToken = await createAccessToken(payload);
    res
      .status(201)
      .send({ accessToken, _id, message: "You have successfully registered!" });
  } catch (error) {
    next(error);
  }
});

usersRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await UsersModel.checkCredentials(email, password);
    if (user) {
      const payload = { _id: user._id, role: user.role, name: user.firstName };
      const accessToken = await createAccessToken(payload);
      res.send({ accessToken, message: "Logged in successfully!" });
    }
  } catch (error) {
    next(error);
  }
});

usersRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  const user = await UsersModel.findById(req.user._id);
  res.send(user);
});

usersRouter.get("/:userId", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const user = await UsersModel.findById(req.params.userId);
    if (user) res.send(user);
    else
      next(
        createHttpError(404, `User with id ${req.params.userId} not found!`)
      );
  } catch (error) {
    next(error);
  }
});

// usersRouter.post("", async (req, res, next) => {
//   try {
//     const user = new UsersModel(req.body);
//     const { _id } = await user.save();
//     res.status(201).send({ _id });
//   } catch (error) {
//     next(error);
//   }
// });

export default usersRouter;
