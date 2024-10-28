import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
   service: 'Gmail',
   auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
   },
});

export const sendPasswordResetEmail = async (user, token) => {
   const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

   try {
      await transporter.sendMail({
         from: process.env.EMAIL_USER,
         to: user.email,
         subject: 'Password Reset Request',
         html: `<p>Hello ${user.name},</p>
                <p>It seems you requested a password reset. Click the link below to reset your password:</p>
                <a href="${resetUrl}">Reset Password</a>
                <p>If you did not request this, please ignore this email.</p>`,
      });
   } catch (error) {
      throw new Error('Failed to send password reset email');
   }
};
