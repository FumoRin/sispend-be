/**
 * @swagger
 * /api/soldier/data/pati:
 *   get:
 *     tags:
 *       - Soldier
 *     summary: Dapatkan seluruh data personil PATI
 *     description: Mengambil seluruh data personil PATI dari database personil
 *     parameters:
 *       - in: query
 *         name: pangkat
 *         description: Pangkat personil
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: page
 *         description: Nomor halaman (default 1)
 *         schema:
 *           type: integer
 *         required: false
 *       - in: query
 *         name: limit
 *         description: Jumlah data per halaman (default 50)
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: Seluruh data personil PATI
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
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
 *                         example: "Ferdi Kurniawan"
 *                       PANGKAT:
 *                         type: string
 *                         example: "Brigjen"
 *                       KESATUAN:
 *                         type: string
 *                         example: "Denmabesad"
 *      500:
 *         description: Terjadi kesalahan server
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Terjadi kesalahan server"
 */

import prisma from "@/lib/prisma";

const PATI_RANKS = ["brigjen", "mayjen", "letjen", "jenderal"];

function isPatiRank(rank) {
  if (!rank) return false;
  return PATI_RANKS.includes(String(rank).toLowerCase());
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pangkat = searchParams.get("pangkat");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 50;
    const skip = (page - 1) * limit;

    const where = {
      AND: [
        {
          PANGKAT: { not: null },
        },
      ],
    };

    if (pangkat) {
      where.AND.push({ PANGKAT: { contains: pangkat, mode: "insensitive" } });
    }

    // Filter by PATI ranks
    where.AND.push({
      OR: PATI_RANKS.map((r) => ({
        PANGKAT: { contains: r, mode: "insensitive" },
      })),
    });

    const list = await prisma.personil.findMany({
      where,
      orderBy: { id: "desc" },
      take: limit,
      skip,
    });

    return Response.json({
      status: 200,
      success: true,
      data: list,
    });
  } catch (error) {
    console.error("PATI GET error:", error);
    return Response.json({
      status: 500,
      success: false,
      error: "Internal Server Error",
    });
  }
}
