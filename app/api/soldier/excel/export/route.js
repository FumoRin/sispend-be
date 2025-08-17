import ExcelJS from "exceljs";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Ambil semua data dari database
    const data = await prisma.personil.findMany();

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada data untuk diexport" },
        { status: 404 }
      );
    }

    // Buat workbook dan sheet
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet("Personil");

    // Semua kolom Personil
    const columns = [
      "NAMA1","NAMA2","NAMA3","KDPKT","PANGKAT","KORPS","HAR","NRP","KELAHIRAN",
      "JAB1","JAB2","JAB3","JAB4","JAB5","TMTTNI","TGAB","BLAB","THAB","KDSAH",
      "TMTMPP","TGMPP","BLMPP","THMPP","SDTG","SDBL","SDTH","TMTHENTI","TGHT",
      "BLHT","THHT","KET1","KET2","KET3","KET4","KET5","KET6","USUL","FLR",
      "NOSKEP","TGSKEP","KEPPRES","TGKEPP","A","BL","TH","KDM","KEPPANG","TGKEPPANG",
      "TGGAL","BLGAL","BLGAL1","THGAL","sumberData"
    ];

    // Tambahkan header
    sheet.addRow(columns);

    // Styling header: warna kuning & bold
    columns.forEach((col, i) => {
      const cell = sheet.getRow(1).getCell(i + 1);
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFFF00" } // kuning
      };
      cell.font = { bold: true };
      cell.alignment = { horizontal: "center" };
    });

    // Tambahkan data
    data.forEach(row => {
      sheet.addRow(columns.map(col => (row[col] !== null && row[col] !== undefined ? String(row[col]) : "")));
    });

    // Set lebar kolom otomatis
    sheet.columns.forEach(column => {
      let maxLength = 10;
      column.eachCell({ includeEmpty: true }, cell => {
        const cellLength = cell.value ? cell.value.toString().length : 0;
        if (cellLength > maxLength) maxLength = cellLength;
      });
      column.width = maxLength + 2;
    });

    // Buat buffer XLSX
    const buffer = await workbook.xlsx.writeBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": "attachment; filename=personil.xlsx",
      },
    });
  } catch (error) {
    console.error("Export Error:", error);
    return NextResponse.json(
      { success: false, error: "Terjadi kesalahan saat mengekspor data" },
      { status: 500 }
    );
  }
}
