"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Heart, Trash2 } from "lucide-react";

export default function RecipeActions({
  recipeId,
  isFavorite,
}: {
  recipeId: string;
  isFavorite: boolean;
}) {
  const [favorite, setFavorite] = useState(isFavorite);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  async function toggleFavorite() {
    const newValue = !favorite;
    setFavorite(newValue);

    const res = await fetch(`/api/recipes/${recipeId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ is_favorite: newValue }),
    });

    if (!res.ok) {
      setFavorite(!newValue);
      toast.error("Fehler beim Speichern");
    }
  }

  async function handleDelete() {
    const res = await fetch(`/api/recipes/${recipeId}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      toast.error("Fehler beim Löschen");
      return;
    }

    toast.success("Rezept gelöscht");
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={toggleFavorite}
        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
      >
        <Heart
          className={`w-5 h-5 ${
            favorite ? "text-red-500 fill-red-500" : "text-gray-400"
          }`}
        />
      </button>

      {showConfirm ? (
        <div className="flex items-center gap-1">
          <button
            onClick={handleDelete}
            className="px-2 py-1 bg-red-600 text-white text-xs rounded-lg"
          >
            Löschen
          </button>
          <button
            onClick={() => setShowConfirm(false)}
            className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-lg"
          >
            Nein
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowConfirm(true)}
          className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Trash2 className="w-5 h-5 text-gray-400" />
        </button>
      )}
    </div>
  );
}
