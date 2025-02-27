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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPassword = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_ROUNDS = 10;
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    const salt = yield bcrypt_1.default.genSalt(SALT_ROUNDS);
    return bcrypt_1.default.hash(password, salt);
});
exports.hashPassword = hashPassword;
const comparePassword = (plain, hashed) => __awaiter(void 0, void 0, void 0, function* () {
    return bcrypt_1.default.compare(plain, hashed);
});
exports.comparePassword = comparePassword;
const generateRandomPassword = () => {
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const specialCharacters = "!@#$%^&*()_+-=[]{};':\"\\|,.<>/?";
    const alphanumericCharacters = "abcdefghijklmnopqrstuvwxyz0123456789";
    const getRandomChar = (chars) => chars[Math.floor(Math.random() * chars.length)];
    let password = "";
    password += getRandomChar(uppercaseLetters);
    password += getRandomChar(specialCharacters);
    for (let i = 0; i < 6; i++) {
        password += getRandomChar(alphanumericCharacters);
    }
    password = password
        .split("")
        .sort(() => 0.5 - Math.random())
        .join("");
    while (password.length < 6) {
        password += getRandomChar(alphanumericCharacters + uppercaseLetters + specialCharacters);
    }
    return password;
};
exports.generateRandomPassword = generateRandomPassword;
