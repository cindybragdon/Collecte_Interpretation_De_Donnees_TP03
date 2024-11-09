"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const winston_logger_1 = require("../logger/winston.logger");
function errorMiddleware(err, req, res, next) {
    console.error(err.stack);
    winston_logger_1.logger.error(`${req.method} ${req.url}`);
    res.status(500).send({ message: "Internal Server Error" });
}
