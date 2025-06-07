"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const validators_1 = require("../middlewares/validators");
const customerController_1 = require("../controllers/customerController");
const router = express_1.default.Router();
router.get('/ping', (_req, res) => {
    console.log('someone pinged here');
    res.send('pong');
});
router.post('/signup', validators_1.validateCreateCustomer, customerController_1.handleSignup);
router.get('/verify-email', customerController_1.verifyEmail);
exports.default = router;
