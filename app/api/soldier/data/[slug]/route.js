import prisma from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { slug } = params;
    const search = slug.trim();

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;

    const total = await prisma.personil.count({
      where: {
        OR: [
          { NAMA1: { contains: search, mode: "insensitive" } },
          { NRP: { contains: search, mode: "insensitive" } },
          { PANGKAT: { contains: search, mode: "insensitive" } },
        ],
      },
    });

    const personil = await prisma.personil.findMany({
      where: {
        OR: [
          { NAMA1: { contains: search, mode: "insensitive" } },
          { NRP: { contains: search, mode: "insensitive" } },
          { PANGKAT: { contains: search, mode: "insensitive" } },
        ],
      },
      skip,
      take: limit,
      orderBy: { NAMA1: "asc" },
    });

    if (personil.length === 0) {
      return new Response(JSON.stringify({ message: "Data tidak ditemukan" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({
        data: personil,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching personil:", error);
    return new Response(
      JSON.stringify({ message: "Terjadi kesalahan server" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
