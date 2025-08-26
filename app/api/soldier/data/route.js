import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page")) || 1;
        const limit = parseInt(searchParams.get("limit")) || 50;

        const skip = (page - 1) * limit;

        const [personil, total] = await Promise.all([
            prisma.personil.findMany({
                skip,
                take: limit
            }),
            prisma.personil.count()
        ]);

        return new Response(JSON.stringify({
            data: personil,
            total,
            page,
            totalPages: Math.ceil(total / limit)
        }), {
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (error) {
        console.error("Error fetching personil:", error);
        return new Response(JSON.stringify({
            error: "Internal Server Error"
        }), {
            status: 500,
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
