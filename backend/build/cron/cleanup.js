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
exports.startCleanupJob = startCleanupJob;
const node_cron_1 = __importDefault(require("node-cron"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
function startCleanupJob() {
    node_cron_1.default.schedule('0 * * * *', () => {
        void (() => __awaiter(this, void 0, void 0, function* () {
            const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
            try {
                const result = yield prisma.customer.deleteMany({
                    where: {
                        emailVerified: false,
                        createdAt: {
                            lt: cutoff,
                        },
                    },
                });
                console.log(`Deleted ${result.count} unverified users`);
            }
            catch (err) {
                console.error('Failed to delete unverified users:', err);
            }
        }))();
    });
}
