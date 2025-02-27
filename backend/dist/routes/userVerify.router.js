"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRouter = void 0;
const express_1 = require("express");
const userVerify_controller_1 = require("../controllers/userVerify.controller");
exports.verifyRouter = (0, express_1.Router)();
exports.verifyRouter.use(userVerify_controller_1.userVerifyController);
