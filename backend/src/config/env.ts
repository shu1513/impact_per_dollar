import dotenv from "dotenv";

if (process.env.NODE_ENV !== 'production') {
    dotenv.config();
  }

const {JWT_SECRET, EMAIL_USER, EMAIL_PASS,PORT} = process.env;

if (!JWT_SECRET) throw new Error("Missing JWT_SECRET in environment variables");
if (!EMAIL_USER) throw new Error("Missing EMAIL_USER in environment variables");
if (!EMAIL_PASS) throw new Error("Missing EMAIL_PASS in environment variables");

export const config = {
    jwtSecret: JWT_SECRET,
    emailUser: EMAIL_USER,
    emailPass: EMAIL_PASS,
    port: PORT ? parseInt(PORT, 10) : 3000,
    tokenExpiration: '24h',
  };