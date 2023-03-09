import express from "express";
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
      res.send({ accessToken });
    }
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
