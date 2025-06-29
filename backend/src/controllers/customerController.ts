import { Request, Response } from 'express';
import { CreateCustomerBody } from '../types/customer';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { isEmailVerificationPayload } from '../utils/typeGuards';
import { prisma } from '../config/prisma';
import { sendVerificationEmail, sendWelcomeEmail, sendInformSignupEmail } from '../utils/email.server';

const frontendUrl = process.env.FRONTEND_URL;
const siteUrl = process.env.SITE_URL;

const SECRET_KEY = process.env.JWT_SECRET as string;
const TOKEN_EXPIRATION = '24h';

export const handleSignup = async (req: Request, res: Response) => {
  // Type guard confirmed in middleware — now safe to assert
  const { firstName, lastName, email } = req.body as CreateCustomerBody;

  try {
    // check if email is already registered
    const existingCustomer = await prisma.customer.findUnique({
      where:{email},
    });

    if (existingCustomer){
      res.status(400).json({message: "This email is alreay registered to another user."});
      return;
    }

    const token = jwt.sign({ firstName, lastName, email }, SECRET_KEY, {
      expiresIn: TOKEN_EXPIRATION,
    });

    const verificationLink = `${siteUrl}/verify-email?token=${token}`;

    await sendVerificationEmail(email,verificationLink, firstName);

    res.status(200).json({ message: 'Verification email sent' });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Error during signup', error });
  }
};

export const verifyEmail = async (req:Request, res:Response)=>{
    const {token}= req.query;
    console.log(token);
    if (typeof token !== "string") {
        res.status(400).json({message:"Invalid token format"});
        return;
    }

    try {
        const payload = jwt.verify(token,config.jwtSecret);

        if (!isEmailVerificationPayload(payload)){
            res.status(400).json({ message: "Invalid token payload" });
            return;
        }

        console.log("JWT_SECRET in Node.js:", process.env.JWT_SECRET);

        const user = await prisma.customer.create({
            data:{
                firstName:payload.firstName,
                lastName:payload.lastName,
                email:payload.email,
                emailVerified:true,
            },
        });
        await sendWelcomeEmail(payload.email, payload.firstName);
        await sendInformSignupEmail(payload.firstName,payload.lastName,payload.email);
        res.redirect(`${frontendUrl}/thank-you?name=${encodeURIComponent(user.firstName)}`);;

    } catch (error){
        if (error instanceof jwt.TokenExpiredError) {
            res.status(400).json({ message: "Token expired" });
            return;
        }
        res.status(500).json({ message: "something went wrong", error });
    }

};