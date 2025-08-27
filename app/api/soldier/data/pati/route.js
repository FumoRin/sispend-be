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
 *         name: nama
 *         description: Nama personil
 *         schema:
 *           type: string
 *         required: false
 *       - in: query
 *         name: nrp
 *         description: NRP personil
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
    const nama = searchParams.get("nama");
    const nrp = searchParams.get("nrp");
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

    if (nama) {
      where.AND.push({ NAMA: { contains: nama, mode: "insensitive" } });
    }

    if (nrp) {
      where.AND.push({ NRP: { contains: nrp, mode: "insensitive" } });
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

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body?.NAMA || !body?.NRP) {
      return new Response(
        JSON.stringify({ error: "Field NAMA and NRP dibutuhkan." }),
        { status: 400 }
      );
    }

    if (!isPatiRank(body?.PANGKAT)) {
      return new Response(
        JSON.stringify({
          error: "PANGKAT yang dimasukkan untuk personil PATI",
        }),
        { status: 400 }
      );
    }

    // Ensure NRP unique handled by DB constraint; we can pre-check for clearer error
    const existing = await prisma.personil.findUnique({
      where: { NRP: body.NRP },
      select: { id: true },
    });
    if (existing) {
      return new Response(JSON.stringify({ error: "NRP duplikat" }), {
        status: 409,
      });
    }

    const created = await prisma.personil.create({
      data: {
        NAMA: body.NAMA,
        PANGKAT: body.PANGKAT,
        NRP: body.NRP,
        KESATUAN: body.KESATUAN ?? null,
        TTL: body.TTL ? new Date(body.TTL) : new Date(),
        TMT_TNI: body.TMT_TNI ?? null,
        NKTPA: body.NKTPA ?? null,
        NPWP: body.NPWP ?? null,
        AUTENTIK: body.AUTENTIK ?? null,
        MDK: body.MDK ?? null,
        MKG: body.MKG ?? null,
        GPT: body.GPT ?? null,
        NO_SKEP: body.NO_SKEP ?? null,
        TGL_SKEP: body.TGL_SKEP ? new Date(body.TGL_SKEP) : null,
        TMT_SKEP: body.TMT_SKEP ? new Date(body.TMT_SKEP) : null,
        TMT_MULAI: body.TMT_MULAI ?? null,
        PENSPOK: body.PENSPOK ?? null,
        SELAMA: body.SELAMA ?? null,
        PASANGAN: body.PASANGAN ?? null,
        TTL_PASANGAN: body.TTL_PASANGAN ? new Date(body.TTL_PASANGAN) : null,
        ANAK_1: body.ANAK_1 ?? null,
        TTL_ANAK_1: body.TTL_ANAK_1 ? new Date(body.TTL_ANAK_1) : null,
        STS_ANAK_1: body.STS_ANAK_1 ?? null,
        ANAK_2: body.ANAK_2 ?? null,
        TTL_ANAK_2: body.TTL_ANAK_2 ? new Date(body.TTL_ANAK_2) : null,
        STS_ANAK_2: body.STS_ANAK_2 ?? null,
        ANAK_3: body.ANAK_3 ?? null,
        TTL_ANAK_3: body.TTL_ANAK_3 ? new Date(body.TTL_ANAK_3) : null,
        STS_ANAK_3: body.STS_ANAK_3 ?? null,
        ANAK_4: body.ANAK_4 ?? null,
        TTL_ANAK_4: body.TTL_ANAK_4 ? new Date(body.TTL_ANAK_4) : null,
        STS_ANAK_4: body.STS_ANAK_4 ?? null,
        PENSPOK_WARI: body.PENSPOK_WARI ?? null,
        RP1: body.RP1 ?? null,
        BRP1: body.BRP1 ?? null,
        RP2: body.RP2 ?? null,
        BRP2: body.BRP2 ?? null,
        TMB_PN: body.TMB_PN ?? null,
        ALAMAT: body.ALAMAT ?? null,
        ALAMAT_ASABRI: body.ALAMAT_ASABRI ?? null,
        UTAMA: body.UTAMA ?? null,
        NO_SERI: body.NO_SERI ?? null,
        NO_SKEP2: body.NO_SKEP2 ?? null,
        TGL_SKEP2: body.TGL_SKEP2 ?? null,
      },
    });

    return new Response(JSON.stringify(created), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PATI POST error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
