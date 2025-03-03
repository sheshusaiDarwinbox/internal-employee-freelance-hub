"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCounters = exports.generateId = exports.IDMap = void 0;
const idCounter_model_1 = require("../models/idCounter.model");
const idCounter_model_2 = require("../models/idCounter.model");
exports.IDMap = {
    EID: "EMP",
    OID: "O",
    GigID: "G",
    DID: "D",
    PID: "P",
    BidID: "B",
    NID: "N",
    ReqID: "Req",
    RefID: "Ref",
};
const generateId = (type, session) => __awaiter(void 0, void 0, void 0, function* () {
    const counterDoc = yield idCounter_model_1.CounterID.findOneAndUpdate({ id: type }, { $inc: { counter: 1 } }, { session, new: true, upsert: true });
    const id = `${exports.IDMap[type]}${counterDoc.counter.toString().padStart(6, "0")}`;
    return id;
});
exports.generateId = generateId;
const initializeCounters = () => __awaiter(void 0, void 0, void 0, function* () {
    const id = yield idCounter_model_1.CounterID.find();
    if (id.length !== 0)
        return;
    for (const id of Object.values(idCounter_model_2.IDs)) {
        console.log(id);
        yield idCounter_model_1.CounterID.findOneAndUpdate({ id }, { $setOnInsert: { counter: 0 } }, // Initialize counter for each role
        { upsert: true }).catch((err) => {
            console.log(err);
        });
    }
});
exports.initializeCounters = initializeCounters;
