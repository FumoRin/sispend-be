import prisma from "@/lib/prisma";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;

    // Ambil query params opsional
    const nrp = searchParams.get("nrp")?.trim();
    const nama = searchParams.get("nama")?.trim();
    const pangkat = searchParams.get("pangkat")?.trim();
    const kesatuan = searchParams.get("kesatuan")?.trim();

    // Build dynamic filter
    const AND = [];
    if (nrp) AND.push({ NRP: { contains: nrp, mode: "insensitive" } });
    if (nama) AND.push({ NAMA: { contains: nama, mode: "insensitive" } });
    if (pangkat) AND.push({ PANGKAT: { contains: pangkat, mode: "insensitive" } });
    if (kesatuan) AND.push({ KESATUAN: { contains: kesatuan, mode: "insensitive" } });

    // Hanya gunakan AND jika ada parameter, kalau tidak kosong pakai empty object (ambil semua)
    const whereClause = AND.length > 0 ? { AND } : {};

    // Hitung total
    const total = await prisma.personil.count({ where: whereClause });

    // Ambil data
    const personil = await prisma.personil.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { NAMA: "asc" },
    });

    if (total === 0 || personil.length === 0) {
      return new Response(
        JSON.stringify({ message: "Data tidak ditemukan" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        data: personil,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Error fetching personil:", error);
    return new Response(
      JSON.stringify({ message: "Terjadi kesalahan server" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
