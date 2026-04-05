import { createClient } from "@/lib/supabase/server";
import { Recipe } from "@/lib/types";
import Navbar from "@/components/Navbar";
import HomeSearch from "@/components/HomeSearch";
import { ChefHat } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const supabase = createClient();

  const { data: recipes } = await supabase
    .from("recipes")
    .select("*, recipe_tags(tag_id, tags(id, name))")
    .order("created_at", { ascending: false });

  const formattedRecipes: Recipe[] = (recipes || []).map((r) => ({
    ...r,
    tags: r.recipe_tags
      ?.map((rt: { tags: { id: string; name: string } | null }) => rt.tags)
      .filter(Boolean) || [],
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-orange-600" />
              <h1 className="text-lg font-bold text-gray-900">Chochichoderdu</h1>
            </div>
            <span className="text-xs text-gray-400">{formattedRecipes.length} Rezepte</span>
          </div>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-4 py-4">
        <HomeSearch recipes={formattedRecipes} />
      </main>

      <Navbar />
    </div>
  );
}
