import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.formData();
    const file = data.get("image");

    if (!file) {
      return NextResponse.json({ success: false, error: "No image found" });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const filename = Date.now() + path.extname(file.name);
    const imagePath = path.join(process.cwd(), "public/schoolImages", filename);

    await writeFile(imagePath, buffer);
    console.log(`Image saved at ${imagePath}`);

    const newSchool = await prisma.schools.create({
      data: {
        name: data.get("name"),
        address: data.get("address"),
        city: data.get("city"),
        state: data.get("state"),
        contact: BigInt(data.get("contact")),
        email_id: data.get("email_id"),
        image: `/schoolImages/${filename}`,
      },
    });

    return NextResponse.json({
      success: true,
      school: {
        ...newSchool,
        contact: newSchool.contact.toString(),
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const schools = await prisma.schools.findMany();
    const serializedSchools = schools.map((school) => ({
      ...school,
      contact: school.contact.toString(),
    }));

    return NextResponse.json(serializedSchools);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
