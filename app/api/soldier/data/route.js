import prisma from "@/lib/prisma";

/**
 * @swagger
 * /api/data/soldier/data:
 *   get:
 *     summary: Ambil daftar personil
 *     description: Mengambil data personil dengan filter opsional dan pagination, ini endpoinnya "/api/data/soldier/data?page=1&limit=10&nama=Ferdi&pangkat=Brigjen" nah untuk nrp, nama, pangkat, kesatuan itu opsional
 *     tags:
 *       - Soldier
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Halaman data (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         required: false
 *         description: Jumlah data per halaman (default 50, maksimal 100)
 *       - in: query
 *         name: nrp
 *         schema:
 *           type: string
 *         required: false
 *         description: Cari berdasarkan NRP
 *       - in: query
 *         name: nama
 *         schema:
 *           type: string
 *         required: false
 *         description: Cari berdasarkan nama
 *       - in: query
 *         name: pangkat
 *         schema:
 *           type: string
 *         required: false
 *         description: Cari berdasarkan pangkat
 *       - in: query
 *         name: kesatuan
 *         schema:
 *           type: string
 *         required: false
 *         description: Cari berdasarkan kesatuan
 *     responses:
 *       200:
 *         description: Data personil berhasil diambil
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       NRP:
 *                         type: string
 *                         example: "123456"
 *                       NAMA:
 *                         type: string
 *                         example: "Ferdi"
 *                       PANGKAT:
 *                         type: string
 *                         example: "Brigjen"
 *                       KESATUAN:
 *                         type: string
 *                         example: "Kodam III"
 *                 page:
 *                   type: integer
 *                   example: 1
 *                 limit:
 *                   type: integer
 *                   example: 50
 *                 total:
 *                   type: integer
 *                   example: 100
 *                 totalPages:
 *                   type: integer
 *                   example: 2
 *       400:
 *         description: Parameter tidak valid
 *       404:
 *         description: Data tidak ditemukan
 *       500:
 *         description: Terjadi kesalahan server
 */

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
