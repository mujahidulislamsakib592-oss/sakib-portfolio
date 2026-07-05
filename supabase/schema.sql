create table if not exists site_settings (
  id bigint primary key default 1,
  site_name text not null default 'sakib Portfolio',
  owner_name text not null default 'Sakib',
  hero_title text not null default 'Designing bold visual stories for brands.',
  hero_subtitle text not null default 'Premium graphic design, video editing, motion graphics, UI/UX, and creative portfolio work.',
  bio text not null default 'Creative designer, editor, and visual storyteller based in Bangladesh.',
  email text not null default 'mujahidulislamsakib592@gamil.com',
  phone text not null default '01902913410',
  whatsapp text not null default '01902913410',
  facebook text default '',
  instagram text default '',
  linkedin text default '',
  github text default '',
  photo_url text default '',
  updated_at timestamptz default now()
);

insert into site_settings (id)
values (1)
on conflict (id) do nothing;

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'Graphic Design',
  description text not null default '',
  image_url text default '',
  featured boolean default false,
  created_at timestamptz default now()
);

create table if not exists services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  price text default '',
  created_at timestamptz default now()
);

insert into projects (title, category, description, featured)
values
  ('Logo Design Collection', 'Logo Design', 'Premium logo concepts and brand marks.', true),
  ('Social Media Campaign', 'Social Media Design', 'Modern campaign graphics for digital platforms.', true),
  ('YouTube Thumbnail Set', 'Thumbnail Design', 'High-impact thumbnail designs for better clicks.', true),
  ('Video Editing Reel', 'Video Editing', 'Fast-paced short form and YouTube video edits.', true)
on conflict do nothing;

insert into services (title, description, price)
values
  ('Graphic Design', 'Posters, banners, thumbnails, print, and social media design.', 'Custom'),
  ('Video Editing', 'Short-form videos, YouTube edits, commercial ads, and color grading.', 'Custom'),
  ('Brand Identity', 'Logo, typography, colors, brand guide, and full visual system.', 'Custom'),
  ('UI Design', 'Modern website and app interface design.', 'Custom')
on conflict do nothing;

alter table site_settings enable row level security;
alter table projects enable row level security;
alter table services enable row level security;

create policy "Public can read settings" on site_settings for select using (true);
create policy "Public can read projects" on projects for select using (true);
create policy "Public can read services" on services for select using (true);

create policy "Logged in users can update settings" on site_settings for update to authenticated using (true) with check (true);
create policy "Logged in users can manage projects" on projects for all to authenticated using (true) with check (true);
create policy "Logged in users can manage services" on services for all to authenticated using (true) with check (true);

insert into storage.buckets (id, name, public)
values ('portfolio-media', 'portfolio-media', true)
on conflict (id) do nothing;

create policy "Public can view media" on storage.objects for select using (bucket_id = 'portfolio-media');
create policy "Logged in users can upload media" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-media');
create policy "Logged in users can update media" on storage.objects for update to authenticated using (bucket_id = 'portfolio-media') with check (bucket_id = 'portfolio-media');
create policy "Logged in users can delete media" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-media');
