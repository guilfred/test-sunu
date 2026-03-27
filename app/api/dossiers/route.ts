import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    await new Promise((resolve) => setTimeout(resolve, 200));
    const year = new Date().getFullYear();
    const ref = `DOS-${year}-${String(Math.floor(Math.random() * 900) + 100).padStart(3, "0")}`;

    return NextResponse.json(
      {
        reference: ref,
        statut: "EN_ATTENTE",
        scoreEstime: body.scoreEstime ?? null,
        createdAt: new Date().toISOString(),
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json({ error: "Requête invalide." }, { status: 400 });
  }
}

export async function GET() {
  const { mockDossiers } = await import("@/lib/mockData");
  return NextResponse.json(mockDossiers);
}
