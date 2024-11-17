"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.roleMiddleware = roleMiddleware;
const winston_logger_1 = require("../logger/winston.logger");
function roleMiddleware(roles) {
    return (req, res, next) => {
        var _a;
        //Le role doit être inclus dans le JWT qui est fourni
        const userRole = (_a = req.body.user.user) === null || _a === void 0 ? void 0 : _a.role;
        //console.log(req.body.user.user)
        if (!userRole || !roles.includes(userRole)) {
            winston_logger_1.logger.warn(`${req.method} ${req.url}`);
            res
                .status(403)
                .json({
                message: "Accès interdit. Vous devez être gestionnaire pour acceder cette route",
            });
            return;
        }
        next(); // Next qui part vers la suite
    };
}
