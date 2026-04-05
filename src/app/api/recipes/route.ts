import { NextRequest, NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/service";

export async function POST(request: NextRequest) {
  try {
    const supabase = createServiceClient();
    const body = await request.json();

    const { error } = await supabase.from("recipes").insert({
      title: body.title,
      source_url: body.source_url,
      source_title: body.source_title,
      description: body.description || null,
      image_url: body.image_url || null,
      servings: body.servings || null,
      ingredients: body.ingredients,
      original_steps: body.original_steps,
      thermomix_steps: body.thermomix_steps,
      raw_scraped_data: body.raw_scraped_data,
      created_by_name: body.created_by_name || null,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Speichern fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
