import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import RecipeSteps from "@/components/RecipeSteps";
import RecipeActions from "@/components/RecipeActions";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Clock, Users, ExternalLink } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*, recipe_tags(tag_id, tags(id, name))")
    .eq("id", params.id)
    .single();

  if (!recipe) notFound();

  const tags =
    recipe.recipe_tags
      ?.map((rt: { tags: { id: string; name: string } | null }) => rt.tags)
      .filter(Boolean) || [];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base font-bold text-gray-900 line-clamp-1">
              {recipe.title}
            </h1>
          </div>
          <RecipeActions recipeId={recipe.id} isFavorite={recipe.is_favorite} />
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4 space-y-6">
        {recipe.image_url && (
          <img
            src={recipe.image_url}
            alt={recipe.title}
            className="w-full h-48 object-cover rounded-xl"
          />
        )}

        <div className="flex items-center gap-4 text-sm text-gray-500">
          {recipe.total_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.total_time_minutes} Min.
            </span>
          )}
          {recipe.servings && (
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {recipe.servings}
            </span>
          )}
          {recipe.source_url && (
            <a
              href={recipe.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-orange-600 hover:text-orange-700"
            >
              <ExternalLink className="w-4 h-4" />
              Original
            </a>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex gap-1.5 flex-wrap">
            {tags.map((tag: { id: string; name: string }) => (
              <span
                key={tag.id}
                className="px-2 py-0.5 bg-orange-50 text-orange-700 text-xs rounded-full"
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-700 mb-2">Zutaten</h2>
            <ul className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50">
              {recipe.ingredients.map(
                (
                  ing: { amount: string; unit: string; name: string; note?: string },
                  i: number
                ) => (
                  <li key={i} className="px-4 py-2 text-sm flex justify-between">
                    <span className="text-gray-900">{ing.name}</span>
                    <span className="text-gray-500">
                      {ing.amount} {ing.unit}
                      {ing.note && ` (${ing.note})`}
                    </span>
                  </li>
                )
              )}
            </ul>
          </div>
        )}

        <div>
          <h2 className="text-sm font-semibold text-gray-700 mb-3">
            Thermomix-Schritte
          </h2>
          <RecipeSteps steps={recipe.thermomix_steps || []} />
        </div>

        {recipe.original_steps && recipe.original_steps.length > 0 && (
          <details className="group">
            <summary className="text-sm font-medium text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
              Originalrezept anzeigen
            </summary>
            <ol className="mt-3 space-y-2 text-sm text-gray-600 list-decimal list-inside">
              {recipe.original_steps.map((step: string, i: number) => (
                <li key={i} className="leading-relaxed">{step}</li>
              ))}
            </ol>
          </details>
        )}
      </main>

      <Navbar />
    </div>
  );
}
