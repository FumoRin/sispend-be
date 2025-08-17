import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const totalPersonil = await prisma.Personil.count();

        return new Response(JSON.stringify({ total: totalPersonil }), {
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error("Error fetching total personil:", error);
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
