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
exports.setAdmin = void 0;
const department_model_1 = require("../models/department.model");
const position_model_1 = require("../models/position.model");
const userAuth_model_1 = require("../models/userAuth.model");
const password_util_1 = require("./password.util");
const setAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findAdmin = yield userAuth_model_1.User.find({ EID: "EMP000000" });
        console.log(findAdmin);
        if (findAdmin.length === 0)
            yield userAuth_model_1.User.create({
                DID: "D000000",
                EID: "EMP000000",
                PID: "P000000",
                role: "Admin",
                ManagerID: "EMP000000",
                doj: new Date(),
                password: yield (0, password_util_1.hashPassword)("admin"),
                email: "temp@gmail.com",
                verified: true,
            }).then(() => {
                console.log("Admin Created");
            });
        const findDepartment = yield department_model_1.DepartmentModel.find({ DID: "D000000" });
        // console.log(findDepartment)
        if (findDepartment.length === 0)
            yield department_model_1.DepartmentModel.create({
                name: "adminDepartment",
                description: "this is admin department",
                DID: "D000000",
                type: "Engineering",
                teamSize: 1,
            }).then(() => {
                console.log("Admin Department Created");
            });
        const findPosition = yield position_model_1.PositionModel.find({ PID: "P000000" });
        if (findPosition.length === 0)
            yield position_model_1.PositionModel.create({
                title: "adminPosition",
                description: "this is admin Position",
                DID: "D000000",
                PID: "P000000",
                salary: 0,
                type: "FullTime",
            }).then(() => {
                console.log("Admin Position Created");
            });
    }
    catch (err) {
        console.log(err);
    }
});
exports.setAdmin = setAdmin;
