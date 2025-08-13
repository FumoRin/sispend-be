import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Mendaftar user baru
 *     description: Mendaftar user baru dengan nama, email, dan password
 *     tags:
 *       - Users
 *     parameters:
 *       - name: name
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: Dimas Faiz
 *       - name: email
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: dimasfaiz@gmail.com
 *       - name: password
 *         in: query
 *         required: true
 *         schema:
 *           type: string
 *         example: passwordrahasia
 *       - name: role
 *         in: query
 *         required: false
 *         schema:
 *           type: string
 *         enum:
 *           - admin
 *           - user
 *         example: admin
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/Users'
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 token:
 *                   type: string
 *             example:
 *               message: User registered successfully
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Bad Request, tidak sesuai dengah format
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 status:
 *                   type: number
 *             examples:
 *               missingFields:
 *                 summary: Name, email, and password are required
 *                 value:
 *                   error: Name, email, and password are required
 *               invalidEmail:
 *                 summary: Invalid email address
 *                 value:
 *                   error: Please provide a valid email address
 *       409:
 *         description: Conflict, email sudah terdaftar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *             example:
 *               error: Email already registered
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 *                   nullable: true
 *             example:
 *               error: Internal Server Error
 *               details: Something went wrong
 */

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();

    if (!name || !email || !password) {
      return new Response(
        JSON.stringify({
          error: "Name, email, and password are required",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({
          error: "Please provide a valid email address",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const existingUser = await prisma.users.findUnique({
      where: { email },
    });

    if (existingUser) {
      return new Response(
        JSON.stringify({
          error: "Email already registered",
        }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.users.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
      },
    });

    const token = jwt.sign(
      {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return new Response(
      JSON.stringify({
        message: "User registered successfully",
        token,
      }),
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error registering user:", error);
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
