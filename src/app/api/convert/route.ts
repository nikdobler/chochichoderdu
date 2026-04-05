import { NextRequest, NextResponse } from "next/server";
import { chatCompletion } from "@/lib/llm";
import { THERMOMIX_SYSTEM_PROMPT, buildConversionPrompt } from "@/lib/prompts";
import { ScrapedRecipe, Ingredient, ThermomixStep } from "@/lib/types";

export const maxDuration = 30;

interface ConversionResult {
  title: string;
  servings: string;
  ingredients: Ingredient[];
  thermomix_steps: ThermomixStep[];
}

export async function POST(request: NextRequest) {
  try {
    const recipe: ScrapedRecipe = await request.json();

    if (!recipe.title && recipe.ingredients.length === 0) {
      return NextResponse.json(
        { error: "Kein Rezept zum Konvertieren" },
        { status: 400 }
      );
    }

    const userPrompt = buildConversionPrompt(recipe);

    const response = await chatCompletion([
      { role: "system", content: THERMOMIX_SYSTEM_PROMPT },
      { role: "user", content: userPrompt },
    ]);

    // JSON aus der Antwort extrahieren (LLM gibt manchmal Markdown-Codeblocks zurück)
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("LLM hat kein gültiges JSON zurückgegeben");
    }

    const result: ConversionResult = JSON.parse(jsonMatch[0]);

    // Grundvalidierung
    if (!result.thermomix_steps || !Array.isArray(result.thermomix_steps)) {
      throw new Error("Keine Thermomix-Schritte in der Antwort");
    }

    return NextResponse.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Konvertierung fehlgeschlagen";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
