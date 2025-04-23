"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCreateCustomer = void 0;
const typeGuards_1 = require("../utils/typeGuards");
const validateCreateCustomer = (req, res, next) => {
    if (!(0, typeGuards_1.isCreateCustomerBody)(req.body)) {
        res.status(400).json({ message: "Invalid request body" });
        return; // Just return, don't return the response
    }
    next();
};
exports.validateCreateCustomer = validateCreateCustomer;
