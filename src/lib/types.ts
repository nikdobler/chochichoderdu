export interface Ingredient {
  amount: string;
  unit: string;
  name: string;
  note?: string;
}

export interface ThermomixStep {
  step_number: number;
  description: string;
  time_seconds: number | null;
  temperature: number | null;
  speed: string;
  direction?: "links" | "rechts";
  accessory?: string;
  tip?: string;
}

export interface Recipe {
  id: string;
  created_at: string;
  updated_at: string;
  created_by: string;
  source_url: string | null;
  source_title: string | null;
  title: string;
  description: string | null;
  image_url: string | null;
  servings: string | null;
  prep_time_minutes: number | null;
  total_time_minutes: number | null;
  ingredients: Ingredient[];
  original_steps: string[];
  thermomix_steps: ThermomixStep[];
  is_favorite: boolean;
  tags?: Tag[];
}

export interface Tag {
  id: string;
  name: string;
}

export interface ScrapedRecipe {
  title: string;
  description?: string;
  image_url?: string;
  servings?: string;
  prep_time?: string;
  total_time?: string;
  ingredients: string[];
  instructions: string[];
  source_url: string;
}
