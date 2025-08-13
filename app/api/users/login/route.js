import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(request) {
  try {
    const { identifier, password } = await request.json();

    if (!identifier || !password) {
      return new Response(
        JSON.stringify({
          error: "Email or Username and password are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const user = await prisma.users.findFirst({
      where: {
        OR: [{ email: identifier }, { name: identifier }],
      },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return new Response(
        JSON.stringify({
          error: "Invalid email or password",
        }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return new Response(
      JSON.stringify({
        message: "Login successful",
        token,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details:
          process.env.NODE_ENV === "development" ? error.message : undefined,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
