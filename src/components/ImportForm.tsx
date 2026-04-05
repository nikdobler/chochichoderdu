"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { ScrapedRecipe, Ingredient, ThermomixStep } from "@/lib/types";
import RecipeSteps from "./RecipeSteps";
import {
  Link as LinkIcon,
  Loader2,
  ChefHat,
  Check,
  ArrowRight,
  RotateCcw,
} from "lucide-react";

type Step = "input" | "scraping" | "preview" | "converting" | "result";

interface ConversionResult {
  title: string;
  servings: string;
  ingredients: Ingredient[];
  thermomix_steps: ThermomixStep[];
}

export default function ImportForm() {
  const [url, setUrl] = useState("");
  const [step, setStep] = useState<Step>("input");
  const [scraped, setScraped] = useState<ScrapedRecipe | null>(null);
  const [converted, setConverted] = useState<ConversionResult | null>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  async function handleScrape(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim()) return;

    setStep("scraping");
    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setScraped(data);
      setStep("preview");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Rezept konnte nicht geladen werden"
      );
      setStep("input");
    }
  }

  async function handleConvert() {
    if (!scraped) return;
    setStep("converting");
    try {
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(scraped),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setConverted(data);
      setStep("result");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Konvertierung fehlgeschlagen"
      );
      setStep("preview");
    }
  }

  async function handleSave() {
    if (!converted || !scraped) return;
    setSaving(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("recipes").insert({
      title: converted.title,
      source_url: scraped.source_url,
      source_title: scraped.title,
      description: scraped.description || null,
      image_url: scraped.image_url || null,
      servings: converted.servings || scraped.servings || null,
      ingredients: converted.ingredients,
      original_steps: scraped.instructions,
      thermomix_steps: converted.thermomix_steps,
      created_by: user?.id,
      raw_scraped_data: scraped,
    });

    if (error) {
      toast.error("Speichern fehlgeschlagen: " + error.message);
      setSaving(false);
      return;
    }

    toast.success("Rezept gespeichert!");
    router.push("/");
    router.refresh();
  }

  function handleReset() {
    setUrl("");
    setStep("input");
    setScraped(null);
    setConverted(null);
  }

  // Step: URL eingeben
  if (step === "input" || step === "scraping") {
    return (
      <form onSubmit={handleScrape} className="space-y-4">
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700 mb-1">
            Rezept-URL
          </label>
          <div className="relative">
            <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.chefkoch.de/rezepte/..."
              required
              disabled={step === "scraping"}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none text-sm disabled:opacity-50"
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={step === "scraping"}
          className="w-full py-3 bg-orange-600 text-white rounded-xl font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
        >
          {step === "scraping" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Rezept wird geladen...
            </>
          ) : (
            <>
              <ChefHat className="w-4 h-4" />
              Rezept importieren
            </>
          )}
        </button>
      </form>
    );
  }

  // Step: Preview des gescrapten Rezepts
  if (step === "preview") {
    return (
      <div className="space-y-4">
        {scraped?.image_url && (
          <img
            src={scraped.image_url}
            alt={scraped.title}
            className="w-full h-48 object-cover rounded-xl"
          />
        )}
        <h2 className="text-lg font-semibold text-gray-900">{scraped?.title}</h2>
        {scraped?.description && (
          <p className="text-sm text-gray-600">{scraped.description}</p>
        )}

        {scraped && scraped.ingredients.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Zutaten</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {scraped.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-orange-400 mt-1">-</span>
                  {ing}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Abbrechen
          </button>
          <button
            onClick={handleConvert}
            className="flex-1 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 transition-colors flex items-center justify-center gap-2"
          >
            Umwandeln
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Step: Konvertierung läuft
  if (step === "converting") {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600 mx-auto mb-4" />
        <p className="text-gray-600 font-medium">Wird für den Thermomix umgewandelt...</p>
        <p className="text-gray-400 text-sm mt-1">Das kann einen Moment dauern</p>
      </div>
    );
  }

  // Step: Ergebnis anzeigen
  if (step === "result" && converted) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{converted.title}</h2>
          {converted.servings && (
            <p className="text-sm text-gray-500 mt-1">{converted.servings}</p>
          )}
        </div>

        {converted.ingredients.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Zutaten</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              {converted.ingredients.map((ing, i) => (
                <li key={i}>
                  {ing.amount} {ing.unit} {ing.name}
                  {ing.note && <span className="text-gray-400"> ({ing.note})</span>}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Thermomix-Schritte</h3>
          <RecipeSteps steps={converted.thermomix_steps} />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            onClick={handleReset}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Nochmal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center justify-center gap-2 flex-1 py-2.5 bg-orange-600 text-white rounded-xl text-sm font-medium hover:bg-orange-700 disabled:opacity-50 transition-colors"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
            Speichern
          </button>
        </div>
      </div>
    );
  }

  return null;
}
