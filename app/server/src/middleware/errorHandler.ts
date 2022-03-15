import { NextFunction, Request, Response } from "express";
import { ErrorResponseType } from "../lib/utils";

const errorHandler = (
  err: ErrorResponseType | any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  if (process.env.NODE_ENV == "production")
    console.log("Error from error middleware ", JSON.stringify(err, null, 4));
  else console.log("Error from error middleware ", err);
  let error = { ...err };
  error.message = err.message;

  // Do some thing if error.mesage include 'call stack exceed'

  if (err.name === "ValidationError") {
    console.log("ValidationError from errorHandler");
    error.message = {};
    Object.keys(err.errors).forEach((key: any) => {
      error.message[key] = err.errors[key].message;
    });
  }

  return res.status(error.statusCode || 500).json({
    status: "error",
    message: error.message || "Server Error",
  });
};

export default errorHandler;
