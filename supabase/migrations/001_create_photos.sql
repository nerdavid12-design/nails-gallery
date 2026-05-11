create extension if not exists "uuid-ossp";

create table public.photos (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  storage_path text not null,
  name text,
  created_at timestamptz not null default now()
);

create index idx_photos_created_at on public.photos (created_at desc);

alter table public.photos enable row level security;

create policy "Photos are publicly readable"
  on public.photos for select
  using (true);

create policy "Anyone can upload photos"
  on public.photos for insert
  with check (true);

create policy "Only admins can delete photos"
  on public.photos for delete
  using (auth.role() = 'authenticated');
