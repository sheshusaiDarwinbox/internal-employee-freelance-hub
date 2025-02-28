"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidModel = void 0;
const mongoose_1 = require("mongoose");
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const bidSchema = new mongoose_1.Schema({
    BID: { type: String, required: true, index: true, unique: true },
    TaskID: { type: String, required: true },
    description: { type: String, required: true },
    EID: { type: String, required: true },
});
bidSchema.plugin(mongoose_paginate_v2_1.default);
exports.BidModel = (0, mongoose_1.model)("Bid", bidSchema);
