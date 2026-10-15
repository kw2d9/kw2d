create table if not exists public.waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  first_name text,
  source text,
  created_at timestamptz not null default now()
);

-- Only the server (service role) writes; no public access.
alter table public.waitlist enable row level security;

grant all on table public.waitlist to service_role;
