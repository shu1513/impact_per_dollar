"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const cleanup_1 = require("./cron/cleanup");
app_1.default.listen(env_1.config.port, () => {
    console.log(`Server running on port ${env_1.config.port}`);
    (0, cleanup_1.startCleanupJob)();
});
