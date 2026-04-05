import { createServiceClient } from "@/lib/supabase/service";
import { Recipe } from "@/lib/types";
import Navbar from "@/components/Navbar";
import HomeSearch from "@/components/HomeSearch";
import InviteButton from "@/components/InviteButton";
import { ChefHat } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function HomePage() {
  const supabase = createServiceClient();

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Rezepte laden fehlgeschlagen:", error);
  }

  const formattedRecipes: Recipe[] = (recipes || []).map((r) => ({
    ...r,
    tags: [],
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChefHat className="w-6 h-6 text-orange-600" />
              <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Chochichoderdu</h1>
            </div>
            <div className="flex items-center gap-3">
              <InviteButton />
              <span className="text-xs text-gray-400">{formattedRecipes.length} Rezepte</span>
            </div>
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
