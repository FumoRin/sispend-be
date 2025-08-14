import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const total = await prisma.Personil.count({
            where: {
                PANGKAT: {
                    in: ["brigjen", "mayjen", "letjen", "jenderal"], // lowercase
                    mode: "insensitive" // agar tidak peduli kapitalisasi
                }
            }
        });

        return new Response(JSON.stringify({ total }), {
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
