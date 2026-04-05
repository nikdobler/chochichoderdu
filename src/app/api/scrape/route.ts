import { NextRequest, NextResponse } from "next/server";
import { scrapeRecipe } from "@/lib/scraper";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Bitte eine gültige URL angeben" },
        { status: 400 }
      );
    }

    // Einfache URL-Validierung
    try {
      new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Ungültige URL" },
        { status: 400 }
      );
    }

    const recipe = await scrapeRecipe(url);
    return NextResponse.json(recipe);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unbekannter Fehler";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
