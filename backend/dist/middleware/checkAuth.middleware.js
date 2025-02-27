"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = void 0;
const httpsStatusCodes_util_1 = require("../utils/httpsStatusCodes.util");
const checkAuth = (roles) => {
    return (req, res, next) => {
        var _a;
        if (!req.isAuthenticated()) {
            res
                .status(httpsStatusCodes_util_1.HttpStatusCodes.UNAUTHORIZED)
                .json({ message: "Unauthorized" });
        }
        if (roles === undefined || (roles === null || roles === void 0 ? void 0 : roles.length) === 0)
            return next();
        for (let role of roles) {
            if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== role)
                res.status(httpsStatusCodes_util_1.HttpStatusCodes.FORBIDDEN).json({ message: "Forbidden" });
        }
        next();
    };
};
exports.checkAuth = checkAuth;
