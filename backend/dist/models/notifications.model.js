"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationModel = void 0;
const mongoose_1 = require("mongoose");
const notificationSchema = new mongoose_1.Schema({
    NID: { type: String, required: true, index: true, unique: true },
    EID: { type: String, required: true },
    description: { type: String, required: true },
    From: { type: String, required: true }
});
exports.NotificationModel = (0, mongoose_1.model)('Notification', notificationSchema);
