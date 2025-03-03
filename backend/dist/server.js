"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.pass = exports.user = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, "../.env") });
const app_1 = require("./app");
const connection_1 = __importDefault(require("./database/connection"));
const adminSetup_util_1 = require("./utils/adminSetup.util");
const counterManager_util_1 = require("./utils/counterManager.util");
exports.user = process.env.NODEJS_GMAIL_APP_USER;
exports.pass = process.env.NODEJS_GMAIL_APP_PASSWORD;
exports.config = {
    service: "gmail",
    auth: {
        user: exports.user,
        pass: exports.pass,
    },
};
(0, connection_1.default)().then(() => {
    console.log(exports.user);
    console.log(process.env);
    const app = (0, app_1.createApp)();
    app.listen(3000, () => {
        console.log("Server running on port 3000");
        (0, adminSetup_util_1.setAdmin)();
        (0, counterManager_util_1.initializeCounters)();
    });
});
