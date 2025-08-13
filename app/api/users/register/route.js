import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export async function POST(request) {
    try {
        const { name, email, password, role } = await request.json();

        if (!name || !email || !password) {
            return new Response(
                JSON.stringify({ 
                    error: "Name, email, and password are required" 
                }), 
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return new Response(
                JSON.stringify({ 
                    error: "Please provide a valid email address" 
                }), 
                {
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const existingUser = await prisma.users.findUnique({
            where: { email }
        });

        if (existingUser) {
            return new Response(
                JSON.stringify({ 
                    error: "Email already registered" 
                }), 
                {
                    status: 409,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: role || "USER"
            }
        });

        const token = jwt.sign(
            { 
                id: newUser.id, 
                email: newUser.email,
                role: newUser.role 
            }, 
            process.env.JWT_SECRET_KEY, 
            { expiresIn: '1h' }
        );

        return new Response(
            JSON.stringify({ 
                message: "User registered successfully",
                token 
            }), 
            {
                status: 201,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        console.error("Error registering user:", error);
        return new Response(
            JSON.stringify({ 
                error: "Internal Server Error",
                details: process.env.NODE_ENV === 'development' ? error.message : undefined
            }), 
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}