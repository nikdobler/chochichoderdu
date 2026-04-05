import * as cheerio from "cheerio";
import { ScrapedRecipe } from "./types";

export async function scrapeRecipe(url: string): Promise<ScrapedRecipe> {
  const response = await fetch(url, {
    headers: {
      "User-Agent":
        "Mozilla/5.0 (compatible; Chochichoderdu/1.0; recipe-importer)",
      Accept: "text/html,application/xhtml+xml",
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!response.ok) {
    throw new Error(`Seite konnte nicht geladen werden (${response.status})`);
  }

  const html = await response.text();
  const $ = cheerio.load(html);

  // Versuche JSON-LD zu finden
  const jsonLdRecipe = extractJsonLd($);
  if (jsonLdRecipe) {
    return { ...jsonLdRecipe, source_url: url };
  }

  // Fallback: Meta-Tags und sichtbaren Text extrahieren
  return extractFallback($, url);
}

function extractJsonLd(
  $: cheerio.CheerioAPI
): Omit<ScrapedRecipe, "source_url"> | null {
  const scripts = $('script[type="application/ld+json"]');
  for (let i = 0; i < scripts.length; i++) {
    try {
      const raw = $(scripts[i]).html();
      if (!raw) continue;

      const data = JSON.parse(raw);
      const recipe = findRecipeInJsonLd(data);
      if (recipe) {
        return parseSchemaOrgRecipe(recipe);
      }
    } catch {
      continue;
    }
  }
  return null;
}

function findRecipeInJsonLd(data: unknown): Record<string, unknown> | null {
  if (!data || typeof data !== "object") return null;

  if (Array.isArray(data)) {
    for (const item of data) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
    return null;
  }

  const obj = data as Record<string, unknown>;

  if (obj["@type"] === "Recipe" || (Array.isArray(obj["@type"]) && obj["@type"].includes("Recipe"))) {
    return obj;
  }

  // Suche in @graph
  if (Array.isArray(obj["@graph"])) {
    for (const item of obj["@graph"]) {
      const found = findRecipeInJsonLd(item);
      if (found) return found;
    }
  }

  return null;
}

function parseSchemaOrgRecipe(
  recipe: Record<string, unknown>
): Omit<ScrapedRecipe, "source_url"> {
  const ingredients = Array.isArray(recipe.recipeIngredient)
    ? (recipe.recipeIngredient as string[])
    : [];

  let instructions: string[] = [];
  if (Array.isArray(recipe.recipeInstructions)) {
    instructions = (recipe.recipeInstructions as unknown[]).map((step) => {
      if (typeof step === "string") return step;
      if (typeof step === "object" && step !== null) {
        const s = step as Record<string, unknown>;
        return (s.text as string) || (s.name as string) || JSON.stringify(step);
      }
      return String(step);
    });
  } else if (typeof recipe.recipeInstructions === "string") {
    instructions = [recipe.recipeInstructions];
  }

  const imageUrl = extractImageUrl(recipe.image);

  return {
    title: (recipe.name as string) || "Unbenanntes Rezept",
    description: (recipe.description as string) || undefined,
    image_url: imageUrl,
    servings: formatYield(recipe.recipeYield),
    prep_time: parseDuration(recipe.prepTime as string),
    total_time: parseDuration(recipe.totalTime as string),
    ingredients,
    instructions,
  };
}

function extractImageUrl(image: unknown): string | undefined {
  if (typeof image === "string") return image;
  if (Array.isArray(image)) return extractImageUrl(image[0]);
  if (typeof image === "object" && image !== null) {
    return (image as Record<string, unknown>).url as string;
  }
  return undefined;
}

function formatYield(y: unknown): string | undefined {
  if (typeof y === "string") return y;
  if (Array.isArray(y)) return y[0]?.toString();
  if (typeof y === "number") return `${y} Portionen`;
  return undefined;
}

function parseDuration(iso: string | undefined): string | undefined {
  if (!iso) return undefined;
  const match = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return iso;
  const hours = parseInt(match[1] || "0");
  const minutes = parseInt(match[2] || "0");
  if (hours > 0) return `${hours} Std. ${minutes} Min.`;
  return `${minutes} Min.`;
}

function extractFallback(
  $: cheerio.CheerioAPI,
  url: string
): ScrapedRecipe {
  const title =
    $('meta[property="og:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $("title").text().trim() ||
    "Unbenanntes Rezept";

  const description =
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    undefined;

  const image_url =
    $('meta[property="og:image"]').attr("content") || undefined;

  // Versuche Textinhalte zu sammeln
  const bodyText = $("article, main, .recipe, [itemtype*='Recipe']")
    .first()
    .text()
    .trim();

  const instructions = bodyText
    ? bodyText
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 10)
        .slice(0, 50)
    : [];

  return {
    title,
    description,
    image_url,
    ingredients: [],
    instructions,
    source_url: url,
  };
}
