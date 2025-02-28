"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const notificationSchema = new mongoose_1.Schema({
    NID: { type: String, required: true, index: true, unique: true },
    EID: { type: String, required: true },
    description: { type: String, required: true },
    From: { type: String, required: true },
});
notificationSchema.plugin(mongoose_paginate_v2_1.default);
exports.NotificationModel = (0, mongoose_1.model)("Notification", notificationSchema);
