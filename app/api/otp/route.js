import prisma from "@/lib/prisma"; // sesuaikan path prisma client-mu
import { sendOtpEmail } from "@/lib/sendOTP";

function generateOTP(length = 6) {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * digits.length)];
  }
  return otp;
}

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      return new Response(
        JSON.stringify({ error: "User not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    const otp = generateOTP(6);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000); 

    await prisma.users.update({
      where: { email },
      data: { otp, otpExpires },
    });

    await sendOtpEmail(email, otp);

    return new Response(
      JSON.stringify({ message: "OTP sent to email" }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
