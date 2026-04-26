alter table if exists public.questions
  add column if not exists image_url text,
  add column if not exists image_alt text;
