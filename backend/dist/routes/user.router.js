"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const checkAuth_middleware_1 = require("../middleware/checkAuth.middleware");
const userAuth_model_1 = require("../models/userAuth.model");
exports.userRouter = (0, express_1.Router)();
exports.userRouter.use("/users", (0, checkAuth_middleware_1.checkAuth)([userAuth_model_1.UserRole.Admin]), user_controller_1.userControlRouter);
