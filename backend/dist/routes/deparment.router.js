"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentRouter = void 0;
const express_1 = require("express");
const department_controller_1 = require("../controllers/department.controller");
const checkAuth_middleware_1 = require("../middleware/checkAuth.middleware");
const userAuth_model_1 = require("../models/userAuth.model");
exports.departmentRouter = (0, express_1.Router)();
exports.departmentRouter.use("/departments", (0, checkAuth_middleware_1.checkAuth)([userAuth_model_1.UserRole.Admin]), department_controller_1.departmentControlRouter);
