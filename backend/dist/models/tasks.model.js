"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskModel = void 0;
const mongoose_1 = require("mongoose");
const tasks_type_1 = require("../types/tasks.type");
const taskSchema = new mongoose_1.Schema({
    TaskID: { type: String, required: true },
    DID: { type: String, required: true },
    managerID: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    EID: { type: String },
    deadline: { type: Date, required: true },
    approvalStatus: {
        type: String,
        enum: Object.values(tasks_type_1.ApprovalStatus),
        default: tasks_type_1.ApprovalStatus.PENDING
    },
    progressStatus: [{
            subject: { type: String },
            description: { type: String },
            work_percentage: { type: Number }
        }],
    skillsRequired: [{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now, required: true },
    assignedAt: { type: Date },
    rewardPoints: { type: Number },
    rating: { type: Number },
    amount: { type: Number },
    feedback: { type: String, required: true }
});
exports.TaskModel = (0, mongoose_1.model)('Tasks', taskSchema);
