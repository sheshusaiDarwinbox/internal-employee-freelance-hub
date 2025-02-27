"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobModel = exports.jobSchema = exports.JobTypeEnum = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var JobTypeEnum;
(function (JobTypeEnum) {
    JobTypeEnum["FullTime"] = "FullTime";
    JobTypeEnum["PartTime"] = "PartTime";
    JobTypeEnum["Internship"] = "Internship";
    JobTypeEnum["Temporary"] = "Temporary";
    JobTypeEnum["Freelance"] = "Freelance";
    JobTypeEnum["Contract"] = "Contract";
    JobTypeEnum["Other"] = "Other";
})(JobTypeEnum || (exports.JobTypeEnum = JobTypeEnum = {}));
exports.jobSchema = new mongoose_1.Schema({
    JID: { type: String, required: true, index: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    type: {
        type: String,
        enum: JobTypeEnum,
        required: true,
    },
    salary: { type: Number },
    DID: { type: mongoose_1.Schema.Types.String, ref: "Department", required: true },
});
exports.jobSchema.plugin(mongoose_paginate_v2_1.default);
exports.JobModel = (0, mongoose_1.model)("Job", exports.jobSchema);
