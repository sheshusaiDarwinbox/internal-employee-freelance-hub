"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = exports.userAuthSchema = exports.UserRole = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var UserRole;
(function (UserRole) {
    UserRole["Employee"] = "Employee";
    UserRole["Other"] = "Other";
    UserRole["Admin"] = "Admin";
    UserRole["Manager"] = "Manager";
})(UserRole || (exports.UserRole = UserRole = {}));
exports.userAuthSchema = new mongoose_1.Schema({
    EID: { type: String, index: true, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    role: {
        type: String,
        enum: UserRole,
        required: true,
    },
    verified: {
        type: Boolean,
        required: true,
    },
    JID: { type: mongoose_1.Schema.Types.String, ref: "Job", required: true },
    DID: { type: mongoose_1.Schema.Types.String, ref: "Department", required: true },
    ManagerID: { type: mongoose_1.Schema.Types.String, ref: "UserAuth", required: true },
    phone: { type: String },
    gender: { type: String },
    dob: { type: String },
    doj: { type: Date, required: true },
    maritalStatus: { type: String },
    nationality: { type: String },
    bloodGroup: { type: String },
    workmode: { type: String },
    address: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: String },
    emergencyContactNumber: { type: Number },
    freelanceRewardPoints: { type: Number },
    freelanceRating: { type: Number },
    skills: { type: [String] },
    accountBalance: { type: Number },
    img: { type: String },
});
exports.userAuthSchema.plugin(mongoose_paginate_v2_1.default);
exports.User = (0, mongoose_1.model)("UserAuth", exports.userAuthSchema);
