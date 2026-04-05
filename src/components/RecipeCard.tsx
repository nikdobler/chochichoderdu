import Link from "next/link";
import { Heart, Clock, ChefHat } from "lucide-react";
import { Recipe } from "@/lib/types";

export default function RecipeCard({ recipe }: { recipe: Recipe }) {
  const timeDisplay = recipe.total_time_minutes
    ? `${recipe.total_time_minutes} Min.`
    : recipe.prep_time_minutes
    ? `${recipe.prep_time_minutes} Min.`
    : null;

  return (
    <Link
      href={`/rezept/${recipe.id}`}
      className="block bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="flex">
        {recipe.image_url ? (
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={recipe.image_url}
              alt={recipe.title}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-24 h-24 flex-shrink-0 bg-orange-50 flex items-center justify-center">
            <ChefHat className="w-8 h-8 text-orange-300" />
          </div>
        )}
        <div className="flex-1 p-3 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-medium text-gray-900 text-sm leading-tight line-clamp-2">
              {recipe.title}
            </h3>
            {recipe.is_favorite && (
              <Heart className="w-4 h-4 text-red-500 fill-red-500 flex-shrink-0 mt-0.5" />
            )}
          </div>
          <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
            {timeDisplay && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {timeDisplay}
              </span>
            )}
            {recipe.servings && (
              <span>{recipe.servings}</span>
            )}
          </div>
          {recipe.tags && recipe.tags.length > 0 && (
            <div className="flex gap-1 mt-2 flex-wrap">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-1.5 py-0.5 bg-orange-50 text-orange-700 text-[10px] rounded-full"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
