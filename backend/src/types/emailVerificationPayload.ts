import { JwtPayload } from 'jsonwebtoken';

export interface EmailVerificationPayload extends JwtPayload {
  firstName: string;
  lastName: string;
  email: string;
  iat?: number; // optional standard JWT fields
  exp?: number;
}
