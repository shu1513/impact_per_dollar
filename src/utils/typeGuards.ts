import { CreateCustomerBody } from "../types/customer";

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
