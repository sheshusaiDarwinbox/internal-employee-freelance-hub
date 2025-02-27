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
exports.jobControlRouter = exports.getJobById = exports.deleteJobByID = exports.getAllJobs = exports.createJob = void 0;
const httpsStatusCodes_util_1 = require("../utils/httpsStatusCodes.util");
const job_model_1 = require("../models/job.model");
const checkAuth_middleware_1 = require("../middleware/checkAuth.middleware");
const zod_util_1 = require("../utils/zod.util");
const express_1 = require("express");
const userAuth_model_1 = require("../models/userAuth.model");
const counterManager_util_1 = require("../utils/counterManager.util");
const department_model_1 = require("../models/department.model");
const idCounter_model_1 = require("../models/idCounter.model");
const error_util_1 = require("../utils/error.util");
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = zod_util_1.CreateJobSchema.parse(req.body);
        const Department = yield department_model_1.DepartmentModel.findOne({ DID: data.DID });
        if (!Department) {
            throw new Error("Department not found");
        }
        const JID = yield (0, counterManager_util_1.generateId)(idCounter_model_1.IDs.JID);
        const job = yield job_model_1.JobModel.create(Object.assign(Object.assign({}, data), { JID }));
        if (!job)
            throw new Error("Job not created");
        res.status(201).json(job);
    }
    catch (err) {
        (0, error_util_1.error)(err, res);
    }
});
exports.createJob = createJob;
const getAllJobs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { types, page = 0 } = req.query;
        const filter = {};
        const pageNum = Number(page);
        if (types) {
            const typesArray = types.split(",");
            zod_util_1.JobsArraySchema.parse(typesArray);
            filter.type = { $in: typesArray };
        }
        const jobs = yield job_model_1.JobModel.paginate(filter, {
            offset: pageNum * 10,
            limit: 10,
        });
        res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(jobs);
    }
    catch (err) {
        (0, error_util_1.error)(err, res);
    }
});
exports.getAllJobs = getAllJobs;
const deleteJobByID = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ID } = req.params;
        zod_util_1.GetJobSchema.parse({ JID: ID });
        const job = yield job_model_1.JobModel.findOne({
            JID: ID,
        });
        if (!job)
            throw new Error("Bad Request");
        const result = yield job_model_1.JobModel.deleteOne({ JID: ID });
        if (result.acknowledged === false)
            throw new Error("Job not deleted");
        res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(job);
    }
    catch (err) {
        (0, error_util_1.error)(err, res);
    }
});
exports.deleteJobByID = deleteJobByID;
const getJobById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { ID } = req.params;
        zod_util_1.GetJobSchema.parse({ JID: ID });
        const job = yield job_model_1.JobModel.findOne({ JID: ID });
        if (!job)
            throw new Error("Bad Request");
        res.status(httpsStatusCodes_util_1.HttpStatusCodes.OK).send(job);
    }
    catch (err) {
        (0, error_util_1.error)(err, res);
    }
});
exports.getJobById = getJobById;
exports.jobControlRouter = (0, express_1.Router)();
exports.jobControlRouter.post("/create", (0, checkAuth_middleware_1.checkAuth)([userAuth_model_1.UserRole.Admin]), exports.createJob);
exports.jobControlRouter.get("", exports.getAllJobs);
exports.jobControlRouter.delete("/:ID", exports.deleteJobByID);
exports.jobControlRouter.get("/:ID", exports.getJobById);
