"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const connect_mongo_1 = __importDefault(require("connect-mongo"));
const mongoose_1 = __importDefault(require("mongoose"));
require("./strategies/local.strategy");
const index_router_1 = require("./routes/index.router");
const cors_1 = __importDefault(require("cors"));
const createApp = () => {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)({
        origin: "http://localhost:5173",
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    }));
    app.use(express_1.default.static("./public"));
    app.use(express_1.default.json());
    app.use((0, cookie_parser_1.default)());
    app.use((0, express_session_1.default)({
        secret: "secret",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
        store: connect_mongo_1.default.create({
            client: mongoose_1.default.connection.getClient(),
        }),
    }));
    app.use(passport_1.default.initialize());
    app.use(passport_1.default.session());
    app.use("/api", index_router_1.indexRouter);
    app.get("/", (req, res) => {
        res.send("Hello World");
    });
    return app;
};
exports.createApp = createApp;
