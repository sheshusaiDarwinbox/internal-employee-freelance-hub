"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BidModel = void 0;
const mongoose_1 = require("mongoose");
const bidSchema = new mongoose_1.Schema({
    BID: { type: String, required: true, index: true, unique: true },
    TaskID: { type: String, required: true },
    description: { type: String, required: true },
    EID: { type: String, required: true }
});
exports.BidModel = (0, mongoose_1.model)('Bid', bidSchema);
