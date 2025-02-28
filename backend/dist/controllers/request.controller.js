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
exports.getSentRequests = exports.getReceivedRequests = exports.createRequest = void 0;
const express_1 = require("express");
const session_util_1 = require("../utils/session.util");
const zod_util_1 = require("../utils/zod.util");
const counterManager_util_1 = require("../utils/counterManager.util");
const idCounter_model_1 = require("../models/idCounter.model");
const request_model_1 = require("../models/request.model");
const httpsStatusCodes_util_1 = require("../utils/httpsStatusCodes.util");
const checkAuth_middleware_1 = require("../middleware/checkAuth.middleware");
const userAuth_model_1 = require("../models/userAuth.model");
const requestControlRouter = (0, express_1.Router)();
exports.createRequest = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    zod_util_1.RequestZodSchema.parse(req.body);
    const { reqType } = req.body;
    const ReqID = (0, counterManager_util_1.generateId)(idCounter_model_1.IDs.ReqID);
    const request = yield request_model_1.RequestModel.create({
        ReqID: ReqID,
        From: (_a = req.user) === null || _a === void 0 ? void 0 : _a.EID,
        To: "EMP000000",
        reqType: reqType,
        description: "create user request to admin",
    });
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.CREATED).send(request);
}));
exports.getReceivedRequests = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page = 0 } = req.params;
    const requests = yield request_model_1.RequestModel.paginate({ To: (_a = req.user) === null || _a === void 0 ? void 0 : _a.EID }, {
        offset: Number(page) * 10,
        limit: 10,
    });
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(requests);
}));
exports.getSentRequests = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { page = 0 } = req.params;
    const requests = yield request_model_1.RequestModel.paginate({ From: (_a = req.user) === null || _a === void 0 ? void 0 : _a.EID }, {
        offset: Number(page) * 10,
        limit: 10,
    });
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(requests);
}));
requestControlRouter.post("/create", (0, checkAuth_middleware_1.checkAuth)([userAuth_model_1.UserRole.Manager]), exports.createRequest);
requestControlRouter.get("/sent", (0, checkAuth_middleware_1.checkAuth)([]), exports.getSentRequests);
requestControlRouter.get("/received", (0, checkAuth_middleware_1.checkAuth)([]), exports.getReceivedRequests);
