import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
   },
});

export const sendVerificationEmail = async (user, token) => {
   const url = `${process.env.CLIENT_URL}/verify-email?token=${token}`;
   try {
      await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to: user.email,
         subject: 'Verify Your Email',
         html: `<p>Hello ${user.name},</p>
            <p>Thank you for signing up! Please verify your email by clicking the link below:</p>
            <a href="${url}">Verify Email</a>`,
      });
   } catch (error) {
      console.error('Error sending verification email:', error);
   }

};
