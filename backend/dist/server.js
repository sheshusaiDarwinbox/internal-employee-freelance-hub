"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const connection_1 = __importDefault(require("./database/connection"));
const adminSetup_util_1 = require("./utils/adminSetup.util");
const counterManager_util_1 = require("./utils/counterManager.util");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
(0, connection_1.default)().then(() => {
    const app = (0, app_1.createApp)();
    app.listen(3000, () => {
        console.log("Server running on port 3000");
        (0, adminSetup_util_1.setAdmin)();
        (0, counterManager_util_1.initializeCounters)();
    });
});
