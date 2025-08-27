/**
 * @swagger
 * /api/soldier/history/year:
 *   get:
 *     tags:
 *       - Soldier
 *     summary: Dapatkan jumlah personil berdasarkan tahun TMT_MULAI
 *     description: Menghitung jumlah personil berdasarkan tahun dari field TMT_MULAI
 *     responses:
 *       200:
 *         description: Jumlah personil berdasarkan tahun THHT
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  data:
 *                    type: array
 *                    items:
 *                      type: object
 *                      properties:
 *                        year:
 *                          type: integer
 *                        count:
 *                          type: integer
 *                  total:
 *                    type: integer
 *                  message:
 *                    type: string
 *       500:
 *         description: Terjadi kesalahan pada server
 *         content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                  success:
 *                    type: boolean
 *                  message:
 *                    type: string
 *                  error:
 *                    type: string
 */

import prisma from "@/lib/prisma";
import { extractTahunDariBulanTahun } from "@/lib/dateParser";

export async function GET() {
  try {
    const totalPersonil = await prisma.Personil.count();
    const allPersonil = await prisma.Personil.findMany({
      select: {
        id: true,
        NAMA: true,
        NRP: true,
        TMT_MULAI: true,
      },
      where: {
        TMT_MULAI: {
          not: null,
        },
      },
    });

    // Parse TMT_MULAI and count by year
    const yearCounts = {};
    let validYearCount = 0;
    let invalidYearCount = 0;

    allPersonil.forEach((personil) => {
      if (personil.TMT_MULAI && personil.TMT_MULAI.trim() !== "") {
        // Parse the year from TMT_MULAI field using Indonesian month-year format
        const year = extractTahunDariBulanTahun(personil.TMT_MULAI);

        if (year !== null) {
          yearCounts[year] = (yearCounts[year] || 0) + 1;
          validYearCount++;
        } else {
          invalidYearCount++;
          console.log(
            `Invalid TMT_MULAI format: "${personil.TMT_MULAI}" for personil ID: ${personil.id}`
          );
        }
      }
    });

    // === DEBUGGING ===
    // console.log("Total Personil records in database:", totalPersonil);
    // console.log("Valid year count:", validYearCount);
    // console.log("Invalid year count:", invalidYearCount);
    // console.log("Year counts object:", yearCounts);

    // Convert to array format for easier consumption
    const yearData = Object.entries(yearCounts)
      .map(([year, count]) => ({
        year: parseInt(year),
        count: count,
        label: `Tahun ${year}`,
      }))
      .sort((a, b) => a.year - b.year);

    return Response.json({
      success: true,
      data: yearData,
      message: "Data berhasil diambil",
    });
  } catch (error) {
    console.error("Error fetching year data:", error);
    return Response.json(
      {
        success: false,
        message: "Terjadi kesalahan saat mengambil data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
