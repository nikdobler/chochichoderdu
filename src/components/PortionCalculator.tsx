"use client";

import { useState } from "react";
import { Ingredient } from "@/lib/types";
import { Minus, Plus } from "lucide-react";

function parseServings(servings: string | null): number {
  if (!servings) return 4;
  const match = servings.match(/(\d+)/);
  return match ? parseInt(match[1]) : 4;
}

function scaleAmount(amount: string, factor: number): string {
  const num = parseFloat(amount.replace(",", "."));
  if (isNaN(num)) return amount;
  const scaled = Math.round(num * factor * 10) / 10;
  return scaled.toString().replace(".", ",");
}

export default function PortionCalculator({
  ingredients,
  originalServings,
}: {
  ingredients: Ingredient[];
  originalServings: string | null;
}) {
  const basePortions = parseServings(originalServings);
  const [portions, setPortions] = useState(basePortions);
  const factor = portions / basePortions;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">Zutaten</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPortions(Math.max(1, portions - 1))}
            className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-sm font-semibold w-14 text-center">
            {portions} Port.
          </span>
          <button
            onClick={() => setPortions(Math.min(8, portions + 1))}
            className="w-7 h-7 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            <Plus className="w-3 h-3" />
          </button>
        </div>
      </div>

      <ul className="bg-white dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 divide-y divide-gray-50 dark:divide-gray-800">
        {ingredients.map((ing, i) => (
          <li key={i} className="px-4 py-2 text-sm flex justify-between">
            <span className="text-gray-900 dark:text-gray-100">{ing.name}</span>
            <span className="text-gray-500 dark:text-gray-400">
              {ing.amount ? scaleAmount(ing.amount, factor) : ""} {ing.unit}
              {ing.note && ` (${ing.note})`}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
