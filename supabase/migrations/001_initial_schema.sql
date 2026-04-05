-- Recipes table
create table public.recipes (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  created_by uuid references auth.users(id) not null,

  source_url text,
  source_title text,

  title text not null,
  description text,
  image_url text,
  servings text,
  prep_time_minutes integer,
  total_time_minutes integer,

  ingredients jsonb not null default '[]'::jsonb,
  original_steps jsonb default '[]'::jsonb,
  thermomix_steps jsonb not null default '[]'::jsonb,

  is_favorite boolean default false,
  raw_scraped_data jsonb
);

-- Tags table
create table public.tags (
  id uuid default gen_random_uuid() primary key,
  name text unique not null
);

-- Junction table
create table public.recipe_tags (
  recipe_id uuid references public.recipes(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (recipe_id, tag_id)
);

-- Default tags
insert into public.tags (name) values
  ('Hauptgericht'), ('Vorspeise'), ('Dessert'), ('Suppe'),
  ('Beilage'), ('Brot'), ('Kuchen'), ('Vegan'),
  ('Vegetarisch'), ('Schnell'), ('Meal Prep');

-- Row Level Security
alter table public.recipes enable row level security;
alter table public.tags enable row level security;
alter table public.recipe_tags enable row level security;

create policy "Authenticated users can view recipes"
  on public.recipes for select to authenticated using (true);

create policy "Authenticated users can insert recipes"
  on public.recipes for insert to authenticated with check (true);

create policy "Authenticated users can update recipes"
  on public.recipes for update to authenticated using (true);

create policy "Authenticated users can delete recipes"
  on public.recipes for delete to authenticated using (true);

create policy "Authenticated users can view tags"
  on public.tags for select to authenticated using (true);

create policy "Authenticated users can manage recipe_tags"
  on public.recipe_tags for all to authenticated using (true);

-- Updated_at trigger
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger recipes_updated_at
  before update on public.recipes
  for each row execute function update_updated_at();
