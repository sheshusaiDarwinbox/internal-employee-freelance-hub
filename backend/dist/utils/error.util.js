"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.error = void 0;
const httpsStatusCodes_util_1 = require("./httpsStatusCodes.util");
const error = (err, res) => {
    if (err instanceof Error) {
        res.status(httpsStatusCodes_util_1.HttpStatusCodes.BAD_REQUEST).json({ message: err.message });
    }
    else
        res
            .status(httpsStatusCodes_util_1.HttpStatusCodes.BAD_REQUEST)
            .json({ message: "Something went wrong" });
};
exports.error = error;
