import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const data = await request.formData();
    const imageUrl = data.get("image");

    if (!imageUrl) {
      return NextResponse.json({ success: false, error: "No image URL found" });
    }

    const newSchool = await prisma.schools.create({
      data: {
        name: data.get("name"),
        address: data.get("address"),
        city: data.get("city"),
        state: data.get("state"),
        contact: BigInt(data.get("contact")),
        email_id: data.get("email_id"),
        image: imageUrl,
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
