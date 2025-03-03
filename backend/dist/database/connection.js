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
exports.default = connect;
const mongoose_1 = __importDefault(require("mongoose"));
const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;
function connect() {
    return __awaiter(this, arguments, void 0, function* (retryCount = 0) {
        try {
            const db = yield mongoose_1.default.connect("mongodb://127.0.0.1:27018,127.0.0.1:27019,127.0.0.1:27020/org", {
                replicaSet: "rs0",
                readPreference: "primary",
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 30000,
                retryWrites: true,
                w: "majority",
                directConnection: false,
            });
            mongoose_1.default.connection.on("connected", () => {
                console.log("MongoDB connected successfully");
            });
            mongoose_1.default.connection.on("error", (err) => {
                console.error("MongoDB connection error:", err);
            });
            mongoose_1.default.connection.on("disconnected", () => {
                console.log("MongoDB disconnected");
            });
            console.log("Database connected");
            return db;
        }
        catch (err) {
            console.error(`Connection attempt ${retryCount + 1} failed:`, err);
            if (retryCount < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
                yield new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL));
                return connect(retryCount + 1);
            }
            console.error("Max retries reached. Could not connect to database.");
            process.exit(1);
        }
    });
}
