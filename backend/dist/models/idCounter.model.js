"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CounterID = exports.IDs = void 0;
const mongoose_1 = require("mongoose");
var IDs;
(function (IDs) {
    IDs["EID"] = "EID";
    IDs["OID"] = "OID";
    IDs["DID"] = "DID";
    IDs["JID"] = "JID";
    IDs["TaskID"] = "TaskID";
    IDs["BidID"] = "BidID";
    IDs["NID"] = "NID";
    IDs["ReqID"] = "ReqID";
    IDs["RefID"] = "RefID";
})(IDs || (exports.IDs = IDs = {}));
const counterSchema = new mongoose_1.Schema({
    id: { type: String, enum: IDs, required: true, unique: true },
    counter: { type: Number, required: true, default: 1 },
});
exports.CounterID = (0, mongoose_1.model)("Counter", counterSchema);
