import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET_KEY;

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return new Response(
        JSON.stringify({ error: "Email dan OTP dibutuhkan" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = await prisma.users.findUnique({ where: { email } });

    if (!user || !user.otp || !user.otpExpires) {
      return new Response(
        JSON.stringify({ error: "OTP tidak ditemukan" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (String(user.otp) !== String(otp)) {
      return new Response(
        JSON.stringify({ error: "OTP salah" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const otpExpires = new Date(user.otpExpires);
    if (isNaN(otpExpires.getTime())) {
      return new Response(
        JSON.stringify({ error: "Data OTP tidak valid" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (new Date() > otpExpires) {
      return new Response(
        JSON.stringify({ error: "OTP sudah kedaluwarsa" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    await prisma.users.update({
      where: { email },
      data: { otp: null, otpExpires: null },
    });

    const otpVerifiedToken = jwt.sign(
      { userId: user.id, email: user.email, otpVerified: true },
      JWT_SECRET,
      { expiresIn: "5m" }
    );

    return new Response(
      JSON.stringify({ message: "OTP valid", otpVerifiedToken: otpVerifiedToken }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
