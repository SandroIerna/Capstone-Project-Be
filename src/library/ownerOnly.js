import createHttpError from "http-errors";

export const ownerOnlyMiddleware = (req, res, next) => {
  if (req.user.role === "Owner") next();
  else next(createHttpError(403, "This endpoint is a owner only endpoint!"));
};
