import prisma from "@/lib/prisma";

const PATI_RANKS = ["brigjen", "mayjen", "letjen", "jenderal"];

function isPatiRank(rank) {
  if (!rank) return false;
  return PATI_RANKS.includes(String(rank).toLowerCase());
}

export async function GET(_request, { params }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid id" }), {
        status: 400,
      });
    }

    const item = await prisma.personil.findFirst({
      where: {
        id,
        OR: PATI_RANKS.map((r) => ({
          PANGKAT: { equals: r, mode: "insensitive" },
        })),
      },
    });
    if (!item) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }
    return new Response(JSON.stringify(item), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PATI by id GET error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid id" }), {
        status: 400,
      });
    }

    const body = await request.json();

    if (body?.PANGKAT && !isPatiRank(body.PANGKAT)) {
      return new Response(
        JSON.stringify({ error: "PANGKAT must remain a PATI rank" }),
        { status: 400 }
      );
    }

    // Ensure the record is PATI-scoped
    const existing = await prisma.personil.findUnique({ where: { id } });
    if (!existing || !isPatiRank(existing.PANGKAT)) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    const updated = await prisma.personil.update({
      where: { id },
      data: {
        NAMA: body.NAMA ?? existing.NAMA,
        PANGKAT: body.PANGKAT ?? existing.PANGKAT,
        NRP: body.NRP ?? existing.NRP,
        KESATUAN: body.KESATUAN ?? existing.KESATUAN,
        TTL: body.TTL ? new Date(body.TTL) : existing.TTL,
        TMT_TNI: body.TMT_TNI ?? existing.TMT_TNI,
        NKTPA: body.NKTPA ?? existing.NKTPA,
        NPWP: body.NPWP ?? existing.NPWP,
        AUTENTIK: body.AUTENTIK ?? existing.AUTENTIK,
        MDK: body.MDK ?? existing.MDK,
        MKG: body.MKG ?? existing.MKG,
        GPT: body.GPT ?? existing.GPT,
        NO_SKEP: body.NO_SKEP ?? existing.NO_SKEP,
        TGL_SKEP: body.TGL_SKEP ? new Date(body.TGL_SKEP) : existing.TGL_SKEP,
        TMT_SKEP: body.TMT_SKEP ? new Date(body.TMT_SKEP) : existing.TMT_SKEP,
        TMT_MULAI: body.TMT_MULAI ?? existing.TMT_MULAI,
        PENSPOK: body.PENSPOK ?? existing.PENSPOK,
        SELAMA: body.SELAMA ?? existing.SELAMA,
        PASANGAN: body.PASANGAN ?? existing.PASANGAN,
        TTL_PASANGAN: body.TTL_PASANGAN
          ? new Date(body.TTL_PASANGAN)
          : existing.TTL_PASANGAN,
        ANAK_1: body.ANAK_1 ?? existing.ANAK_1,
        TTL_ANAK_1: body.TTL_ANAK_1
          ? new Date(body.TTL_ANAK_1)
          : existing.TTL_ANAK_1,
        STS_ANAK_1: body.STS_ANAK_1 ?? existing.STS_ANAK_1,
        ANAK_2: body.ANAK_2 ?? existing.ANAK_2,
        TTL_ANAK_2: body.TTL_ANAK_2
          ? new Date(body.TTL_ANAK_2)
          : existing.TTL_ANAK_2,
        STS_ANAK_2: body.STS_ANAK_2 ?? existing.STS_ANAK_2,
        ANAK_3: body.ANAK_3 ?? existing.ANAK_3,
        TTL_ANAK_3: body.TTL_ANAK_3
          ? new Date(body.TTL_ANAK_3)
          : existing.TTL_ANAK_3,
        STS_ANAK_3: body.STS_ANAK_3 ?? existing.STS_ANAK_3,
        ANAK_4: body.ANAK_4 ?? existing.ANAK_4,
        TTL_ANAK_4: body.TTL_ANAK_4
          ? new Date(body.TTL_ANAK_4)
          : existing.TTL_ANAK_4,
        STS_ANAK_4: body.STS_ANAK_4 ?? existing.STS_ANAK_4,
        PENSPOK_WARI: body.PENSPOK_WARI ?? existing.PENSPOK_WARI,
        RP1: body.RP1 ?? existing.RP1,
        BRP1: body.BRP1 ?? existing.BRP1,
        RP2: body.RP2 ?? existing.RP2,
        BRP2: body.BRP2 ?? existing.BRP2,
        TMB_PN: body.TMB_PN ?? existing.TMB_PN,
        ALAMAT: body.ALAMAT ?? existing.ALAMAT,
        ALAMAT_ASABRI: body.ALAMAT_ASABRI ?? existing.ALAMAT_ASABRI,
        UTAMA: body.UTAMA ?? existing.UTAMA,
        NO_SERI: body.NO_SERI ?? existing.NO_SERI,
        NO_SKEP2: body.NO_SKEP2 ?? existing.NO_SKEP2,
        TGL_SKEP2: body.TGL_SKEP2 ?? existing.TGL_SKEP2,
      },
    });

    return new Response(JSON.stringify(updated), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("PATI PUT error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}

export async function DELETE(_request, { params }) {
  try {
    const id = Number(params.id);
    if (Number.isNaN(id)) {
      return new Response(JSON.stringify({ error: "Invalid id" }), {
        status: 400,
      });
    }

    // Scope to PATI by checking before delete
    const existing = await prisma.personil.findUnique({ where: { id } });
    if (!existing || !isPatiRank(existing.PANGKAT)) {
      return new Response(JSON.stringify({ error: "Not found" }), {
        status: 404,
      });
    }

    await prisma.personil.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("PATI DELETE error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
