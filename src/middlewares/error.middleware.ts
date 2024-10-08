import { Request, Response, NextFunction } from "express";
import { logger } from "../logger/winston.logger";

export function errorMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);
  logger.error(`${req.method} ${req.url}`);
  res.status(500).send({ message: "Internal Server Error" });
}
