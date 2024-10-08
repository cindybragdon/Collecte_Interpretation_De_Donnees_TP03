import express, { Request, Response, NextFunction } from "express"; // Ajoute Request et Response
import { join } from "node:path";
import { createLogger, format, transports } from "winston";

const app = express();

export const logger = createLogger({
  level: "info",
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "./src/logger/app.log" }),
  ],
});

// Fonction middleware avec les bons types
const logAll = function (
  request: Request,
  response: Response,
  next: NextFunction
) {
  logger.info(`L'application a démarré : ${request.url}`);
  logger.warn("Attention, ceci est un avertissement");
  logger.error("Une erreur est survenue");
  next();
};

app.use(express.json());
app.use(express.static(join(process.cwd(), "src", "public")));
app.use(logAll);
