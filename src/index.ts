import express, {Request,Response} from 'express';
import { PrismaClient } from "@prisma/client";
import { CreateCustomerBody } from './types/customer';
import dotenv from 'dotenv';
import { startCleanupJob } from './cron/cleanup';
import jwt from "jsonwebtoken";
import { validateCreateCustomer } from './middlewares/validators';
import { isEmailVerificationPayload } from './utils/typeGuards';

dotenv.config();
const app = express();
app.use(express.json());

if (!process.env.JWT_SECRET) {
  throw new Error("Missing JWT_SECRET in environment variables");
}
const SECRET_KEY = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = "24h";

// import { requireEnv, requireNumberEnv } from './utils/env';
import nodemailer from 'nodemailer';

    const transporter= nodemailer.createTransport({
      service:"gmail",
      auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS,
      }
    });

const prisma = new PrismaClient();

const PORT = 3000;

app.get('/ping',(_req,res)=>{
    console.log('someone pinged here');
    res.send('pong');
});

app.get('/customers',async (_req,res)=>{
    const users = await prisma.customer.findMany();
    res.json(users);
});

app.post("/signup",validateCreateCustomer, async (req:Request<Record<string, unknown>, Record<string, unknown>,CreateCustomerBody>, res:Response) => {

    const { firstName, lastName, email } = req.body;

    try {
      const token = jwt.sign({ firstName, lastName, email }, SECRET_KEY, {
        expiresIn: TOKEN_EXPIRATION,
      });

      const verificationLink = `http://localhost:3000/verify-email?token=${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verify your email",
        text: `Hello ${firstName}\n\nPlease click on the link to verify your email:\n${verificationLink}`,
      });

      res.status(200).json({ message: "Verification email sent" });
    } catch (error) {
      console.error("Signup error:", error);
      res.status(500).json({ message: "Error during signup", error });
    }
  }
);

app.get('/verify-email', async (req,res)=>{
  

    const {token} = req.query;

    if (typeof token !== 'string') {
      res.status(400).json({ message: "Invalid token format" });
      return;
    }

    try{
        const payload = jwt.verify(token,SECRET_KEY);

        // verify token
        if (!isEmailVerificationPayload(payload)) {
          res.status(400).json({ message: "Invalid token payload" });
          return;
        }

        const user = await prisma.customer.create({
        data:{
          firstName: payload.firstName,
          lastName:payload.lastName,
          email:payload.email,
          emailVerified:true,
        }
    });
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: payload.email,
          subject:"welcome",
          text:`hello ${payload.firstName}, thanks for signing up`
        });

    res.json(user);

  } catch (error) {
        res.status(500).json({message: "invalid or expired token", error});
    }
});

startCleanupJob();

app.listen(PORT, ()=>{
    console.log(`Server running port ${PORT}`);
});