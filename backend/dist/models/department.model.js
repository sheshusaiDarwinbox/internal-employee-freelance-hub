"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DepartmentModel = exports.DepartmentEnum = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var DepartmentEnum;
(function (DepartmentEnum) {
    DepartmentEnum["Engineering"] = "Engineering";
    DepartmentEnum["Product"] = "Product";
    DepartmentEnum["Finance"] = "Finance";
    DepartmentEnum["Marketing"] = "Marketing";
    DepartmentEnum["Sales"] = "Sales";
    DepartmentEnum["CustomerSupport"] = "Customer Support";
    DepartmentEnum["Other"] = "Other";
})(DepartmentEnum || (exports.DepartmentEnum = DepartmentEnum = {}));
const departmentSchema = new mongoose_1.Schema({
    DID: { type: String, required: true, index: true, unique: true },
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    type: {
        type: String,
        required: true,
        enum: DepartmentEnum,
    },
    teamSize: { type: Number, required: true },
});
departmentSchema.plugin(mongoose_paginate_v2_1.default);
exports.DepartmentModel = (0, mongoose_1.model)("Department", departmentSchema);
