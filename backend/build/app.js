"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const customerRoutes_1 = __importDefault(require("./routes/customerRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// const corsOptions = {
//     origin:
//         process.env.NODE_ENV === 'production' 
//             ? process.env.FRONTEND_URL
//             : true,
//     credentials: true,
// };
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/', customerRoutes_1.default);
app.get('/ping', (_req, res) => {
    res.send('pong');
});
exports.default = app;
