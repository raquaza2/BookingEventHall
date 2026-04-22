import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { setAdminSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { adminLoginSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = adminLoginSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid credentials." }, { status: 400 });
  }

  const admin = await prisma.adminUser.findUnique({
    where: { email: parsed.data.email }
  });

  if (!admin) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  const passwordMatches = await bcrypt.compare(parsed.data.password, admin.passwordHash);
  if (!passwordMatches) {
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  await setAdminSession(admin.id, admin.email);

  return NextResponse.json({ ok: true });
}

