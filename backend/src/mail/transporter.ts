import nodemailer from 'nodemailer';
import {config} from '../config/env';

if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Missing EMAIL_USER or EMAIL_PASS in environment variales");
}

export const transporter = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user:config.emailUser,
        pass:config.emailPass,
    }
});