import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../utils/jwt.util";
import { logger } from "../logger/winston.logger";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    console.log(req.headers);
    logger.error(`STATUS 403 : ${req.method} ${req.url}`);
    res.status(403).json({ message: "Accès refusé. Aucun token fourni." });
    return;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    //console.log(decoded)
    req.body.user = decoded;
    next(); // Next middleware est appellé
  } catch (error) {
    logger.error(`STATUS 401 : ${req.method} ${req.url}`);
    res.status(401).json({ message: "Token invalide." });
    return;
  }
};
