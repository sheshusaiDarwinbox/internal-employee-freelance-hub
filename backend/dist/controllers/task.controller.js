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
exports.getTaskById = exports.getAllTasks = exports.createTask = exports.taskControlRouter = void 0;
const express_1 = require("express");
const zod_util_1 = require("../utils/zod.util");
const userAuth_model_1 = require("../models/userAuth.model");
const task_model_1 = require("../models/task.model");
const request_model_1 = require("../models/request.model");
const counterManager_util_1 = require("../utils/counterManager.util");
const idCounter_model_1 = require("../models/idCounter.model");
const httpsStatusCodes_util_1 = require("../utils/httpsStatusCodes.util");
const checkAuth_middleware_1 = require("../middleware/checkAuth.middleware");
const session_util_1 = require("../utils/session.util");
const zod_1 = require("zod");
exports.taskControlRouter = (0, express_1.Router)();
exports.createTask = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = zod_util_1.CreateTaskZodSchema.parse(req.body);
    const manager = yield userAuth_model_1.User.findOne({
        EID: data.ManagerID,
    });
    const TaskID = yield (0, counterManager_util_1.generateId)(idCounter_model_1.IDs.TaskID);
    if (!manager || !TaskID)
        throw new Error("manager not found or TaskID not created");
    const taskdata = Object.assign(Object.assign({}, data), { DID: manager.DID, TaskID: TaskID, createdAt: Date.now(), ongoingStatus: task_model_1.OngoingStatus.UnAssigned, approvalStatus: data.amount > 0 ? task_model_1.ApprovalStatus.PENDING : task_model_1.ApprovalStatus.APPROVED });
    const task = yield task_model_1.Task.create(taskdata);
    if (!task)
        throw new Error("failed to create task");
    if (data.amount > 0) {
        const request = yield request_model_1.RequestModel.create({
            ReqID: yield (0, counterManager_util_1.generateId)(idCounter_model_1.IDs.ReqID),
            From: data.ManagerID,
            To: "EMP000000",
            reqType: request_model_1.RequestTypeEnum.ApproveTask,
            description: `Request to approve task from ${data.ManagerID}`,
        });
        if (!request)
            throw new Error("failed to create request");
    }
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.CREATED).send(data);
}));
exports.getAllTasks = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { DIDs, ManagerIDs, search, page = 0 } = req.query;
    let filter = {};
    if (DIDs) {
        zod_1.z.array(zod_1.z
            .string()
            .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })).parse(DIDs);
        filter.DID = { $in: DIDs };
    }
    if (ManagerIDs) {
        zod_1.z.array(zod_1.z
            .string()
            .regex(/^[a-zA-Z0-9]+$/, { message: "Id must be alphanumeric" })).parse(DIDs);
        filter.ManagerID = { $in: ManagerIDs };
    }
    if (search) {
        zod_1.z.string().regex(/^[a-zA-Z0-9\s.,!?()&]+$/, "search must be alphanumeric with grammar notations (e.g., spaces, punctuation).");
        filter = Object.assign(Object.assign({}, filter), { $text: { $search: search } });
    }
    const tasks = yield task_model_1.Task.paginate(filter, {
        offset: Number(page) * 10,
        limit: 10,
    });
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(tasks);
}));
exports.getTaskById = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { TaskID } = req.params;
    zod_util_1.GetIDSchema.parse({ ID: TaskID });
    const task = yield task_model_1.Task.findOne({ JID: TaskID });
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(task);
}));
exports.taskControlRouter.post("/post", (0, checkAuth_middleware_1.checkAuth)([userAuth_model_1.UserRole.Manager]), exports.createTask);
exports.taskControlRouter.get("", (0, checkAuth_middleware_1.checkAuth)([]), exports.getAllTasks);
exports.taskControlRouter.get("/:TaskID", (0, checkAuth_middleware_1.checkAuth)([]), exports.getTaskById);
