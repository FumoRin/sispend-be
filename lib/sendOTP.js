import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: `${process.env.APP_NAME} <${process.env.EMAIL_USER}>`,
    to,
    subject: "Email Verification Request",
    html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f6f9fc; border-radius: 8px;">
            <h1 style="color: #333; text-align: center; margin-bottom: 10px;">Verification Request</h1>
            <p style="font-size: 16px; color: #555; text-align: left;">
              Please use the following One-Time Password (OTP) to verify your account at <strong>${process.env.APP_NAME}</strong>:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <span style="display: inline-block; font-size: 26px; font-weight: bold; background: #555; color: white; padding: 12px 24px; border-radius: 8px; letter-spacing: 3px;">
                ${otp}
              </span>
            </div>
            <p style="font-size: 14px; color: #777; text-align: left;">
              This OTP is valid for <strong>5 minutes</strong>. Do not share it with anyone for security reasons.
            </p>
            <p style="font-size: 14px; color: #777; margin-top: 20px; text-align: left;">
              from,<br/>
              <strong>${process.env.APP_NAME}</strong>
            </p>
          </div>

    `,
  };

  return transporter.sendMail(mailOptions);
}
