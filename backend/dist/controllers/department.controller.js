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
exports.departmentControlRouter = exports.getDepartmentByID = exports.deleteDepartmentByID = exports.getAllDepartments = exports.createDepartment = void 0;
const httpsStatusCodes_util_1 = require("../utils/httpsStatusCodes.util");
const department_model_1 = require("../models/department.model");
const zod_util_1 = require("../utils/zod.util");
const express_1 = require("express");
const counterManager_util_1 = require("../utils/counterManager.util");
const idCounter_model_1 = require("../models/idCounter.model");
const error_util_1 = require("../utils/error.util");
const createDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = zod_util_1.CreateDepartmentSchema.parse(req.body);
        const DID = yield (0, counterManager_util_1.generateId)(idCounter_model_1.IDs.DID);
        const departmentData = Object.assign(Object.assign({}, data), { DID });
        const department = yield department_model_1.DepartmentModel.create(departmentData);
        if (!department)
            throw new Error("Server Error");
        res.status(201).send(department);
    }
    catch (err) {
        (0, error_util_1.error)(err, res);
    }
});
exports.createDepartment = createDepartment;
const getAllDepartments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { types, page = 0 } = req.query;
        const filter = {};
        const pageNum = Number(page);
        if (types) {
            const typesArray = types.split(",");
            zod_util_1.DepartmentArraySchema.parse(typesArray);
            filter.type = { $in: typesArray };
        }
        const departments = yield department_model_1.DepartmentModel.paginate(filter, {
            offset: pageNum * 10,
            limit: 10,
        });
        res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(departments);
    }
    catch (err) {
        (0, error_util_1.error)(err, res);
    }
});
exports.getAllDepartments = getAllDepartments;
const deleteDepartmentByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
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
    }
    catch (err) {
        (0, error_util_1.error)(err, res);
    }
});
exports.deleteDepartmentByID = deleteDepartmentByID;
const getDepartmentByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ID } = req.params;
        zod_util_1.GetDepartmentSchema.parse({ DID: ID });
        const department = yield department_model_1.DepartmentModel.findOne({ DID: ID });
        if (!department)
            throw new Error("Bad Request");
        res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(department);
    }
    catch (err) {
        (0, error_util_1.error)(err, res);
    }
});
exports.getDepartmentByID = getDepartmentByID;
exports.departmentControlRouter = (0, express_1.Router)();
exports.departmentControlRouter.post("/create", exports.createDepartment);
exports.departmentControlRouter.get("", exports.getAllDepartments);
exports.departmentControlRouter.delete("/:ID", exports.deleteDepartmentByID);
exports.departmentControlRouter.get("/:ID", exports.getDepartmentByID);
