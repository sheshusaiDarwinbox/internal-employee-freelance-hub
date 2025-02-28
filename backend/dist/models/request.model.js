"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestModel = exports.ReqStatus = exports.RequestTypeEnum = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
var RequestTypeEnum;
(function (RequestTypeEnum) {
    RequestTypeEnum["ApproveTask"] = "ApproveTask";
    RequestTypeEnum["CreateUser"] = "CreateUser";
    RequestTypeEnum["DeleteUser"] = "DeleteUser";
})(RequestTypeEnum || (exports.RequestTypeEnum = RequestTypeEnum = {}));
var ReqStatus;
(function (ReqStatus) {
    ReqStatus["Complete"] = "Complete";
    ReqStatus["Pending"] = "Pending";
    ReqStatus["Rejected"] = "Rejected";
})(ReqStatus || (exports.ReqStatus = ReqStatus = {}));
const requestSchema = new mongoose_1.Schema({
    ReqID: { type: String, required: true, index: true, unique: true },
    From: { type: String, required: true },
    To: { type: String, required: true },
    reqType: {
        type: String,
        required: true,
        enum: Object.values(RequestTypeEnum),
    },
    description: { type: String },
});
requestSchema.plugin(mongoose_paginate_v2_1.default);
exports.RequestModel = (0, mongoose_1.model)("Request", requestSchema);
