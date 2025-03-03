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
exports.departmentControlRouter = exports.assignManagerToDepartment = exports.getDepartmentByID = exports.deleteDepartmentByID = exports.getAllDepartments = exports.createDepartment = void 0;
const httpsStatusCodes_util_1 = require("../utils/httpsStatusCodes.util");
const department_model_1 = require("../models/department.model");
const zod_util_1 = require("../utils/zod.util");
const express_1 = require("express");
const counterManager_util_1 = require("../utils/counterManager.util");
const idCounter_model_1 = require("../models/idCounter.model");
const userAuth_model_1 = require("../models/userAuth.model");
const session_util_1 = require("../utils/session.util");
const checkAuth_middleware_1 = require("../middleware/checkAuth.middleware");
exports.createDepartment = (0, session_util_1.sessionHandler)((req, res, session) => __awaiter(void 0, void 0, void 0, function* () {
    const data = zod_util_1.CreateDepartmentSchema.parse(req.body);
    const DID = yield (0, counterManager_util_1.generateId)(idCounter_model_1.IDs.DID, session);
    const departmentData = Object.assign(Object.assign({}, data), { DID });
    const department = yield department_model_1.DepartmentModel.create(departmentData);
    if (!department)
        throw new Error("Server Error");
    res.status(201).send(department);
}));
exports.getAllDepartments = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { types, page = 0, search = "" } = req.query;
    const filter = {};
    const pageNum = Number(page);
    if (types) {
        const typesArray = types.split(",");
        zod_util_1.DepartmentArraySchema.parse(typesArray);
        filter.type = { $in: typesArray };
    }
    if (search !== "") {
        filter.$text = { $search: search };
    }
    const departments = yield department_model_1.DepartmentModel.paginate(filter, {
        offset: pageNum * 10,
        limit: 10,
    });
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(departments);
}));
exports.deleteDepartmentByID = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID } = req.params;
    zod_util_1.GetDepartmentSchema.parse({ DID: ID });
    const department = yield department_model_1.DepartmentModel.findOne({
        DID: ID,
    });
    if (!department)
        throw new Error("Bad Request");
    const result = yield department_model_1.DepartmentModel.deleteOne({ DID: ID });
    if (result.deletedCount === 0)
        throw new Error("Department not deleted");
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(department);
}));
exports.getDepartmentByID = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { ID } = req.params;
    zod_util_1.GetDepartmentSchema.parse({ DID: ID });
    const department = yield department_model_1.DepartmentModel.findOne({ DID: ID });
    if (!department)
        throw new Error("Bad Request");
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(department);
}));
exports.assignManagerToDepartment = (0, session_util_1.sessionHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = zod_util_1.AssignManagerZodSchema.parse(req.body);
    const user = yield userAuth_model_1.User.findOne({ EID: data.EID });
    const department = yield department_model_1.DepartmentModel.findOne({
        DID: data.DID,
    });
    if (!user ||
        !department ||
        department.ManagerID !== undefined ||
        user.DID !== department.DID)
        throw new Error("user or department not found OR department already assigned with a manager OR user does not belong to given Department");
    const updatedDepartment = yield department_model_1.DepartmentModel.updateOne({ DID: data.DID }, {
        $set: {
            ManagerID: data.EID,
        },
    });
    if (!updatedDepartment)
        throw new Error("failed to assign manager");
    res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(updatedDepartment);
}));
exports.departmentControlRouter = (0, express_1.Router)();
exports.departmentControlRouter.post("/create", (0, checkAuth_middleware_1.checkAuth)([userAuth_model_1.UserRole.Admin]), exports.createDepartment);
exports.departmentControlRouter.get("", (0, checkAuth_middleware_1.checkAuth)([]), exports.getAllDepartments);
exports.departmentControlRouter.delete("/:ID", (0, checkAuth_middleware_1.checkAuth)([userAuth_model_1.UserRole.Admin]), exports.deleteDepartmentByID);
exports.departmentControlRouter.get("/:ID", (0, checkAuth_middleware_1.checkAuth)([]), exports.getDepartmentByID);
exports.departmentControlRouter.post("/assign-manager", (0, checkAuth_middleware_1.checkAuth)([userAuth_model_1.UserRole.Admin]), exports.assignManagerToDepartment);
