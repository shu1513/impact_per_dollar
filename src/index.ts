import express, {Request,Response} from 'express';
import { PrismaClient } from "@prisma/client";
import { CreateCustomerBody } from './types/customer';
import dotenv from 'dotenv';
import { startCleanupJob } from './cron/cleanup';
import jwt from "jsonwebtoken";
import { isCreateCustomerBody } from './utils/typeGuards';
dotenv.config();

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
    

const app = express();
app.use(express.json());
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

app.post("/signup", async (    req: Request<Record<string, unknown>, unknown, unknown>,
  res: Response)=>{
  if (!isCreateCustomerBody(req.body)) {
  return res.status(400).json({ message: "Invalid request body" });
  }
  const {firstName, lastName, email} = req.body;
  try {
    const token = jwt.sign({firstName,lastName,email}, SECRET_KEY, {expiresIn: TOKEN_EXPIRATION});
    const verificationLink = `http://localhost:3000/verify-email?token=${token}`;
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Verify your email",
      text: `Hello ${firstName} \n\nPlease click on the link to verify your email:\n${verificationLink}`
    });
    res.status(200).json({message:"verification email sent"});
  } catch (error){
    res.status(500).json({ message: "Error during signup", error });
  }
});

app.post('/customers', async (req:Request<Record<string, unknown>, Record<string, unknown>,CreateCustomerBody>, res:Response)=>{
    const {firstName, lastName, email} = req.body;
    try{
        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject:"welcome",
          text:`hello ${firstName}, thanks for signing up`
        });
        const user = await prisma.customer.create({
        data:{firstName,lastName,email}
    });
    res.json(user);} catch (error) {
        res.status(500).json({message: "Error signing up", error});
    }
});

startCleanupJob();

app.listen(PORT, ()=>{
    console.log(`Server running port ${PORT}`);
});