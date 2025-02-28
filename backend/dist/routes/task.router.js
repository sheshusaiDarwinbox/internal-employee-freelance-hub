"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRouter = void 0;
const express_1 = require("express");
const task_controller_1 = require("../controllers/task.controller");
exports.taskRouter = (0, express_1.Router)();
exports.taskRouter.use("/tasks", task_controller_1.taskControlRouter);
