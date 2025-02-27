"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginControlRouter = void 0;
const express_1 = require("express");
const passport_1 = __importDefault(require("passport"));
exports.loginControlRouter = (0, express_1.Router)();
exports.loginControlRouter.post("/login", passport_1.default.authenticate("local"), (req, res) => {
    res.json({
        message: "Login successful",
        user: req.user
    });
});
exports.loginControlRouter.post("/logout", (req, res) => {
    req.logout((err) => {
        if (err)
            return res.sendStatus(400);
        res.sendStatus(200);
    });
});
exports.loginControlRouter.get("/status", (req, res) => {
    res.send(req.user);
});
