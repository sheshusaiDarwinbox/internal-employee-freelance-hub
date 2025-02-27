"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestModel = void 0;
const mongoose_1 = require("mongoose");
const requests_types_1 = require("../types/requests.types");
const requestSchema = new mongoose_1.Schema({
    ReqID: { type: String, required: true, index: true, unique: true },
    FromEID: { type: String, required: true },
    ToEID: { type: String, required: true },
    reqType: {
        type: String,
        required: true,
        enum: Object.values(requests_types_1.RequestTypeEnum),
    }
});
exports.RequestModel = (0, mongoose_1.model)('Request', requestSchema);
