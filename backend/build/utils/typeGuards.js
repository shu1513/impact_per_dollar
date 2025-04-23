"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isCreateCustomerBody = isCreateCustomerBody;
exports.isEmailVerificationPayload = isEmailVerificationPayload;
function isCreateCustomerBody(body) {
    if (typeof body === 'object' &&
        body !== null) {
        const obj = body; // safely cast for property access
        return (typeof obj.firstName === 'string' &&
            typeof obj.lastName === 'string' &&
            typeof obj.email === 'string');
    }
    return false;
}
function isEmailVerificationPayload(payload) {
    if (typeof payload === 'object' &&
        payload !== null) {
        const obj = payload;
        return (typeof obj.firstName === 'string' &&
            typeof obj.lastName === 'string' &&
            typeof obj.email === 'string');
    }
    return false;
}
