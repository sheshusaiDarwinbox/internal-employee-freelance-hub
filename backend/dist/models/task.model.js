"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Task = exports.OngoingStatus = exports.ApprovalStatus = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var ApprovalStatus;
(function (ApprovalStatus) {
    ApprovalStatus["PENDING"] = "PENDING";
    ApprovalStatus["APPROVED"] = "APPROVED";
    ApprovalStatus["REJECTED"] = "REJECTED";
})(ApprovalStatus || (exports.ApprovalStatus = ApprovalStatus = {}));
var OngoingStatus;
(function (OngoingStatus) {
    OngoingStatus["UnAssigned"] = "UnAssigned";
    OngoingStatus["Ongoing"] = "Ongoing";
    OngoingStatus["Completed"] = "Completed";
    OngoingStatus["Reviewed"] = "Reviewed";
})(OngoingStatus || (exports.OngoingStatus = OngoingStatus = {}));
const taskSchema = new mongoose_1.Schema({
    TaskID: { type: String, required: true },
    DID: { type: String, required: true },
    ManagerID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    EID: { type: String },
    deadline: { type: Date, required: true },
    approvalStatus: {
        type: String,
        enum: Object.values(ApprovalStatus),
        default: ApprovalStatus.PENDING,
    },
    progressTracking: [
        {
            subject: { type: String },
            description: { type: String },
            work_percentage: { type: Number },
        },
    ],
    ongoingStatus: {
        type: String,
        enum: Object.values(OngoingStatus),
    },
    skillsRequired: [{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now, required: true },
    assignedAt: { type: Date },
    rewardPoints: { type: Number },
    rating: { type: Number },
    amount: { type: Number, required: true },
    feedback: { type: String },
});
taskSchema.index({ title: "text" });
taskSchema.plugin(mongoose_paginate_v2_1.default);
exports.Task = (0, mongoose_1.model)("Tasks", taskSchema);
