-- Grant admin access to an existing Supabase Auth user (create the user first in the
-- dashboard: Authentication -> Users -> Add user). Replace the email, then run:
--   psql "$DATABASE_URL" -f supabase/make-admin.sql
update auth.users
set raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb) || '{"role":"admin"}'::jsonb
where email = 'REPLACE_WITH_ADMIN_EMAIL'
returning email, raw_app_meta_data->>'role' as role;
