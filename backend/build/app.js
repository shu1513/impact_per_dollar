"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cutomerRoutes_1 = __importDefault(require("./routes/cutomerRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/', cutomerRoutes_1.default);
app.get('/ping', (_req, res) => {
    res.send('pong');
});
exports.default = app;
