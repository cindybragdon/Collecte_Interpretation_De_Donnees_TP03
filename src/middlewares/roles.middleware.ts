import { Request, Response, NextFunction } from "express";
import { logger } from "../logger/winston.logger";

export function roleMiddleware(roles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    //Le role doit être inclus dans le JWT qui est fourni
    const userRole = req.body.user.user?.role;
    //console.log(req.body.user.user)

    if (!userRole || !roles.includes(userRole)) {
      logger.warn(`${req.method} ${req.url}`);
      res
        .status(403)
        .json({
          message:
            "Accès interdit. Vous devez être gestionnaire pour acceder cette route",
        });
      return;
    }

    next(); // Next qui part vers la suite
  };
}
