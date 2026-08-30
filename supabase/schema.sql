-- MAISON LA GRACE — Schéma des tables applicatives (commandes, avis,
-- fournisseurs, journal d'activité, messages de contact).
--
-- À exécuter une fois dans l'éditeur SQL de votre projet Supabase
-- (https://app.supabase.com/project/_/sql/new). Idempotent : peut être
-- relancé sans effet destructeur.
--
-- Toutes ces tables ont RLS activé SANS AUCUNE POLICY : ni le rôle anon
-- ni le rôle authenticated ne peuvent lire ou écrire dedans directement.
-- Le seul accès passe par la clé "service role" (SUPABASE_SERVICE_ROLE_KEY),
-- utilisée uniquement côté serveur (routes API), qui contourne RLS. C'est
-- volontaire : cela évite d'exposer ces données via l'API Supabase publique
-- pendant que l'application n'a pas de système de comptes clients complet.

create table if not exists public.orders (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  address text not null,
  city text not null,
  postal_code text not null,
  country text not null default 'France',
  delivery_method text not null,
  payment_method text not null,
  items jsonb not null,
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total numeric(10,2) not null,
  promo_code text,
  status text not null default 'En attente'
);
alter table public.orders enable row level security;
create index if not exists orders_created_at_idx on public.orders (created_at desc);
create index if not exists orders_customer_email_idx on public.orders (customer_email);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  product_id text not null,
  product_name text not null,
  author_name text not null,
  rating smallint not null check (rating between 1 and 5),
  comment text not null,
  approved boolean not null default false
);
alter table public.reviews enable row level security;
create index if not exists reviews_created_at_idx on public.reviews (created_at desc);

create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  nom text not null,
  specialite text,
  contact text,
  email text,
  produits integer not null default 0,
  delai text,
  actif boolean not null default true
);
alter table public.suppliers enable row level security;

create table if not exists public.activity_log (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  actor text not null,
  action text not null,
  target text,
  type text not null default 'system'
);
alter table public.activity_log enable row level security;
create index if not exists activity_log_created_at_idx on public.activity_log (created_at desc);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  handled boolean not null default false
);
alter table public.contact_messages enable row level security;
