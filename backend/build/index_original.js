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
const express_1 = __importDefault(require("express"));
const client_1 = require("@prisma/client");
const dotenv_1 = __importDefault(require("dotenv"));
const cleanup_1 = require("./cron/cleanup");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const validators_1 = require("./middlewares/validators");
const typeGuards_1 = require("./utils/typeGuards");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
if (!process.env.JWT_SECRET) {
    throw new Error("Missing JWT_SECRET in environment variables");
}
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = "24h";
// import { requireEnv, requireNumberEnv } from './utils/env';
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});
const prisma = new client_1.PrismaClient();
const PORT = 3000;
app.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
app.get('/customers', (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma.customer.findMany();
    res.json(users);
}));
app.post("/signup", validators_1.validateCreateCustomer, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email } = req.body;
    try {
        const token = jsonwebtoken_1.default.sign({ firstName, lastName, email }, SECRET_KEY, {
            expiresIn: TOKEN_EXPIRATION,
        });
        const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
        yield transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify your email",
            text: `Hello ${firstName}\n\nPlease click on the link to verify your email:\n${verificationLink}`,
        });
        res.status(200).json({ message: "Verification email sent" });
    }
    catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Error during signup", error });
    }
}));
app.get('/verify-email', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    if (typeof token !== 'string') {
        res.status(400).json({ message: "Invalid token format" });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, SECRET_KEY);
        // verify token
        if (!(0, typeGuards_1.isEmailVerificationPayload)(payload)) {
            res.status(400).json({ message: "Invalid token payload" });
            return;
        }
        const user = yield prisma.customer.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                emailVerified: true,
            }
        });
        yield transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: payload.email,
            subject: "welcome",
            text: `hello ${payload.firstName}, thanks for signing up`
        });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: "invalid or expired token", error });
    }
}));
(0, cleanup_1.startCleanupJob)();
app.listen(PORT, () => {
    console.log(`Server running port ${PORT}`);
});
