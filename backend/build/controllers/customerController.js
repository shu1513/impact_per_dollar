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
exports.verifyEmail = exports.handleSignup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const transporter_1 = require("../mail/transporter");
const env_1 = require("../config/env");
const typeGuards_1 = require("../utils/typeGuards");
const prisma_1 = require("../config/prisma");
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = '24h';
const handleSignup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Type guard confirmed in middleware — now safe to assert
    const { firstName, lastName, email } = req.body;
    try {
        const token = jsonwebtoken_1.default.sign({ firstName, lastName, email }, SECRET_KEY, {
            expiresIn: TOKEN_EXPIRATION,
        });
        const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
        yield transporter_1.transporter.sendMail({
            from: env_1.config.emailUser,
            to: email,
            subject: 'Verify your email',
            text: `Hello ${firstName},\n\nPlease click on the link to verify your email:\n${verificationLink}`,
        });
        res.status(200).json({ message: 'Verification email sent' });
    }
    catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Error during signup', error });
    }
});
exports.handleSignup = handleSignup;
const verifyEmail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.query;
    console.log(token);
    if (typeof token !== "string") {
        res.status(400).json({ message: "Invalid token format" });
        return;
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, env_1.config.jwtSecret);
        if (!(0, typeGuards_1.isEmailVerificationPayload)(payload)) {
            res.status(400).json({ message: "Invalid token payload" });
            return;
        }
        console.log("JWT_SECRET in Node.js:", process.env.JWT_SECRET);
        const user = yield prisma_1.prisma.customer.create({
            data: {
                firstName: payload.firstName,
                lastName: payload.lastName,
                email: payload.email,
                emailVerified: true,
            },
        });
        yield transporter_1.transporter.sendMail({
            from: env_1.config.emailUser,
            to: payload.email,
            subject: "Welcome",
            text: `Hello ${payload.firstName}, thanks for signing up`,
        });
        yield transporter_1.transporter.sendMail({
            from: env_1.config.emailUser,
            to: env_1.config.emailUser,
            subject: `${payload.firstName} ${payload.lastName} signed up`,
            text: `${payload.firstName} ${payload.lastName} signed up. email is ${payload.email}`,
        });
        res.json(user);
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            res.status(400).json({ message: "Token expired" });
            return;
        }
        res.status(500).json({ message: "something went wrong", error });
    }
});
exports.verifyEmail = verifyEmail;
