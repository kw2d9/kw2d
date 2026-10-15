create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_session_id text not null unique,
  stripe_payment_intent text,
  email text,
  name text,
  amount_total integer not null,
  currency text not null default 'cad',
  shipping jsonb,
  status text not null default 'paid',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  variant_id uuid references public.product_variants(id) on delete set null,
  title text not null,
  size text,
  qty integer not null check (qty > 0),
  unit_amount integer not null
);

alter table public.orders enable row level security;
alter table public.order_items enable row level security;
grant all on public.orders, public.order_items to service_role;
