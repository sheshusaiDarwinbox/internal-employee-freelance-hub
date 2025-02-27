"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jobRouter = void 0;
const express_1 = require("express");
const job_controller_1 = require("../controllers/job.controller");
exports.jobRouter = (0, express_1.Router)();
exports.jobRouter.use("/jobs", job_controller_1.jobControlRouter);
