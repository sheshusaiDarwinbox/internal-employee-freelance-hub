"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.forgotPassword = exports.forgotPasswordSchema = void 0;
const mongoose_1 = require("mongoose");
exports.forgotPasswordSchema = new mongoose_1.Schema({
    forgotVerifyString: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: "1h" },
});
exports.forgotPasswordSchema.index({ createdAt: 1 }, { expireAfterSeconds: 3600 });
exports.forgotPassword = (0, mongoose_1.model)("forgotPassword", exports.forgotPasswordSchema);
