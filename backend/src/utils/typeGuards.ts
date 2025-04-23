import { CreateCustomerBody } from "../types/customer";
import { EmailVerificationPayload } from "../types/emailVerificationPayload";

export function isCreateCustomerBody(body: unknown): body is CreateCustomerBody {
  if (
    typeof body === 'object' &&
    body !== null
  ) {
    const obj = body as Record<string, unknown>; // safely cast for property access

    return (
      typeof obj.firstName === 'string' &&
      typeof obj.lastName === 'string' &&
      typeof obj.email === 'string'
    );
  }

  return false;
}

export function isEmailVerificationPayload(payload: unknown): payload is EmailVerificationPayload {
  if (
    typeof payload === 'object' &&
    payload !== null
  ) {
    const obj = payload as Record<string, unknown>;
    return (
      typeof obj.firstName === 'string' &&
      typeof obj.lastName === 'string' &&
      typeof obj.email === 'string'
    );
  }
  return false;
}

