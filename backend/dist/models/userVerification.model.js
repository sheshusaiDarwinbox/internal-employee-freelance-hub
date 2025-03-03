"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserVerification = exports.userVerificationSchema = void 0;
const mongoose_1 = require("mongoose");
exports.userVerificationSchema = new mongoose_1.Schema({
    verifyString: { type: String, required: true },
    email: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now, expires: "6h" },
});
// userVerificationSchema.index({ createdAt: 1 }, { expireAfterSeconds: 21600 });
exports.UserVerification = (0, mongoose_1.model)("userVerification", exports.userVerificationSchema);
