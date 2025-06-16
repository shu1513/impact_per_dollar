// app/utils/email.server.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send the verification email.
 */
export async function sendVerificationEmail(to: string, verificationLink: string, firstName:string) {
  try {const result = await resend.emails.send({
    from: `"Team Impact Per Dollar" <${process.env.EMAIL_USER}>`,
    to,
    subject: `${firstName} Please verify your email`,
    text: `Thank you ${firstName} for inquiring. Please verify your email by clicking this link: ${verificationLink}`,
    html: `
      <div>
        <h1>Verify your email</h1>
        <p>Click the link below to verify your email address:</p>
        <p><a href="${verificationLink}">Verify email</a></p>
      </div>
    `,
  });
  console.log("Resend API response:", result);}
  catch (error) {
    console.error("❌ Failed to send verification email:", error);
    throw new Error("Failed to send verification email. Please try again later.");
  }
}

/**
 * Send the welcome email.
 */
export async function sendWelcomeEmail(to: string, firstName: string) {
  await resend.emails.send({
    from: `"Team Impact Per Dollar" <${process.env.EMAIL_USER}>`,
    to,
    subject: 'Welcome to Impact per Dollar',
    text: `Hello ${firstName}, thanks for reaching out to us. A team member will be in touch.`,
    html: `
      <div>
        <h1>Welcome to Impact per Dollar</h1>
        <p>Hello ${firstName}, thanks for reaching out to us. A team member will be in touch in 72 hours.</p>
      </div>
    `,
  });
}

export async function sendInformSignupEmail( firstName: string, lastName:string, email:string) {
  await resend.emails.send({
    from: `"Team Impact Per Dollar" <${process.env.EMAIL_USER}>`,
    to: `${process.env.HOST_EMAIL}`,
    subject: `${firstName} ${lastName} has signed up`,
    text: `${firstName} ${lastName} at ${email} has signed up.`,
    html: `
      <div>
        <h1>${firstName} ${lastName} has signed up</h1>
        <p>H${firstName} ${lastName} at ${email} has signed up.</p>
      </div>
    `,
  });
}
