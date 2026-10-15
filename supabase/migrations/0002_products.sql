create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  handle text not null unique,
  title text not null,
  collection text,
  subtitle text,
  description text,
  price_cents integer not null check (price_cents >= 0),
  currency text not null default 'CAD',
  images text[] not null default '{}',
  size_chart_image text,
  preorder boolean not null default false,
  ships_note text,
  fit_note text,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  size text not null,
  sku text unique,
  inventory integer,            -- null = not tracked (pre-order)
  sort_order integer not null default 0,
  unique (product_id, size)
);

alter table public.products enable row level security;
alter table public.product_variants enable row level security;

create policy "public read active products" on public.products
  for select to anon, authenticated using (active);
create policy "public read variants" on public.product_variants
  for select to anon, authenticated
  using (exists (select 1 from public.products p where p.id = product_id and p.active));

grant select on public.products, public.product_variants to anon, authenticated;
grant all on public.products, public.product_variants to service_role;
