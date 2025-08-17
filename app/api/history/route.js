// app/api/history/route.ts (Next.js 13+ app router)
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const histories = await prisma.history.findMany({
      orderBy: { createdAt: "desc" }, // history terbaru paling atas
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        personil: {
          select: {
            id: true,
            NAMA1: true,
            NAMA2: true,
            NAMA3: true,
            PANGKAT: true,
            KORPS: true,
          },
        },
      },
    });

    return NextResponse.json(histories, { status: 200 });
  } catch (error) {
    console.error("GET History Error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil history" },
      { status: 500 }
    );
  }
}
export async function POST(request) {
  try {
    const { userId, personilId, action, detail } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { error: "userId dan action wajib diisi" },
        { status: 400 }
      );
    }

    const history = await prisma.history.create({
      data: {
        userId,
        personilId: personilId || null, // bisa null
        action,
        detail: detail || null,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        personil: {
          select: {
            id: true,
            NAMA1: true,
            NAMA2: true,
            NAMA3: true,
            PANGKAT: true,
            KORPS: true,
          },
        },
      },
    });

    return NextResponse.json(history, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Gagal menambahkan history" },
      { status: 500 }
    );
  }
}
