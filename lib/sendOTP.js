import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail", // contoh pakai Gmail, sesuaikan dengan provider emailmu
  auth: {
    user: process.env.EMAIL_USER, // email pengirim
    pass: process.env.EMAIL_PASS, // password aplikasi email atau app password Gmail
  },
});

export async function sendOtpEmail(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Code",
    text: `Kode OTP Anda adalah: ${otp}. Berlaku selama 5 menit.`,
  };

  return transporter.sendMail(mailOptions);
}
