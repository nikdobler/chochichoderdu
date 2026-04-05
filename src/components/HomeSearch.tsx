"use client";

import { useState } from "react";
import { Recipe } from "@/lib/types";
import RecipeCard from "./RecipeCard";
import { Search, Heart } from "lucide-react";

export default function HomeSearch({ recipes }: { recipes: Recipe[] }) {
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const filtered = recipes.filter((r) => {
    const matchesQuery =
      !query || r.title.toLowerCase().includes(query.toLowerCase());
    const matchesFav = !favoritesOnly || r.is_favorite;
    return matchesQuery && matchesFav;
  });

  return (
    <>
      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rezept suchen..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none"
          />
        </div>
        <button
          onClick={() => setFavoritesOnly(!favoritesOnly)}
          className={`px-3 py-2 rounded-lg border transition-colors ${
            favoritesOnly
              ? "bg-red-50 border-red-200 text-red-600"
              : "bg-white border-gray-200 text-gray-400 hover:text-gray-600"
          }`}
        >
          <Heart className={`w-4 h-4 ${favoritesOnly ? "fill-red-500" : ""}`} />
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">
            {recipes.length === 0
              ? "Noch keine Rezepte importiert"
              : "Keine Rezepte gefunden"}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} />
          ))}
        </div>
      )}
    </>
  );
}
