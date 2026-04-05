import { createServiceClient } from "@/lib/supabase/service";
import { notFound } from "next/navigation";
import RecipeSteps from "@/components/RecipeSteps";
import RecipeActions from "@/components/RecipeActions";
import PortionCalculator from "@/components/PortionCalculator";
import Navbar from "@/components/Navbar";
import { ArrowLeft, Clock, ExternalLink, User } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createServiceClient();

  const { data: recipe } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!recipe) notFound();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-base font-bold text-gray-900 dark:text-gray-100 line-clamp-1">
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

        <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
          {recipe.total_time_minutes && (
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {recipe.total_time_minutes} Min.
            </span>
          )}
          {recipe.created_by_name && (
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {recipe.created_by_name}
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

        {recipe.ingredients && recipe.ingredients.length > 0 && (
          <PortionCalculator
            ingredients={recipe.ingredients}
            originalServings={recipe.servings}
          />
        )}

        <div>
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
            Thermomix-Schritte
          </h2>
          <RecipeSteps steps={recipe.thermomix_steps || []} />
        </div>

        {recipe.original_steps && recipe.original_steps.length > 0 && (
          <details className="group">
            <summary className="text-sm font-medium text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300 transition-colors">
              Originalrezept anzeigen
            </summary>
            <ol className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400 list-decimal list-inside">
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
