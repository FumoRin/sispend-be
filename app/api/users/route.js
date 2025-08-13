import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const users = await prisma.users.findMany({
            select: {
                name: true,
                email: true,
                role: true
            }
        });
        return new Response(JSON.stringify(users), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        return new Response(JSON.stringify({
            error: "Internal Server Error"
        }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
}