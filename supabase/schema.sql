-- ==========================================================
-- कारीगर सारथी (Shilp Sathi) - Supabase Database Schema
-- SIH26090: AI Virtual Business Manager for Artisans
-- ==========================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Artisans Guild Table
create table if not exists artisans (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  phone text unique,
  region text,
  craft_speciality text,
  bank_account_dbt text,
  mosje_certified boolean default true,
  created_at timestamp with time zone default now()
);

-- 2. Products Table
create table if not exists products (
  id text primary key,
  artisan_id uuid references artisans(id) on delete set null,
  title_en text not null,
  title_hi text not null,
  category text,
  price numeric not null,
  artisan_wage numeric,
  materials text[],
  dimensions text,
  description_en text,
  description_hi text,
  image_url text,
  gi_tagged boolean default true,
  in_stock boolean default true,
  ai_pricing jsonb,
  ondc_schema jsonb,
  created_at timestamp with time zone default now()
);

-- 3. Orders Table
create table if not exists orders (
  id uuid primary key default uuid_generate_v4(),
  product_id text references products(id) on delete cascade,
  product_title text,
  buyer_name text not null,
  buyer_phone text not null,
  shipping_address text not null,
  total_amount numeric not null,
  payment_method text default 'UPI',
  payment_status text default 'confirmed',
  created_at timestamp with time zone default now()
);

-- Turn on Row Level Security (RLS)
alter table artisans enable row level security;
alter table products enable row level security;
alter table orders enable row level security;

-- Public Read & Insert Policies for Hackathon Demo
create policy "Allow public read on products" on products for select using (true);
create policy "Allow public insert on products" on products for insert with check (true);
create policy "Allow public update on products" on products for update using (true);
create policy "Allow public delete on products" on products for delete using (true);

create policy "Allow public read on orders" on orders for select using (true);
create policy "Allow public insert on orders" on orders for insert with check (true);
