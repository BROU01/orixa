-- =========================================================
-- ORIXA — Schéma Supabase (table CMS + sécurité RLS)
--
-- À exécuter UNE FOIS dans : Supabase → SQL Editor → New query
-- (ou dans l'onglet « SQL » du projet), puis cliquer sur RUN.
--
-- Ce schéma crée une table clé/valeur « cms » qui stocke tout le
-- contenu de la boutique (produits, thème, menu, pages…).
--
-- SÉCURITÉ (Row Level Security) :
--   • Lecture publique : uniquement les lignes « public »
--     (produits, thème, menu…) — les visiteurs voient le site.
--   • Lecture admin    : toutes les lignes, y compris « private »
--     (ex. la liste des utilisateurs internes).
--   • Écriture         : réservée à l'administrateur (email ci-dessous).
-- =========================================================

-- 1) La table de contenu -------------------------------------
create table if not exists public.cms (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  -- 'public'  : visible par tous (contenu de la boutique)
  -- 'private' : visible uniquement par l'admin (ex. orixa:users)
  visibility text not null default 'public',
  updated_at timestamptz not null default now()
);

-- Compatibilité : si la table existait déjà sans la colonne
-- visibility (ancienne version du schéma), on l'ajoute.
alter table public.cms
  add column if not exists visibility text not null default 'public';

-- 2) Active la sécurité au niveau des lignes -------------------
alter table public.cms enable row level security;

-- 3) Politiques d'accès ----------------------------------------
-- Lecture : le public lit les lignes « public » ; l'admin lit tout.
-- ⚠️ Remplacez admin@2026.fr par l'e-mail exact du compte admin
-- créé dans Authentication → Users.
drop policy if exists cms_select_public on public.cms;
create policy "cms_select_public" on public.cms
  for select using (
    visibility = 'public'
    or auth.jwt() ->> 'email' = 'admin@2026.fr'
  );

-- Écriture : uniquement le compte administrateur.
drop policy if exists cms_insert_admin on public.cms;
create policy "cms_insert_admin" on public.cms
  for insert with check (auth.jwt() ->> 'email' = 'admin@2026.fr');

drop policy if exists cms_update_admin on public.cms;
create policy "cms_update_admin" on public.cms
  for update using (auth.jwt() ->> 'email' = 'admin@2026.fr');

drop policy if exists cms_delete_admin on public.cms;
create policy "cms_delete_admin" on public.cms
  for delete using (auth.jwt() ->> 'email' = 'admin@2026.fr');

-- 4) Horodatage automatique à chaque écriture -------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_cms_updated_at on public.cms;
create trigger trg_cms_updated_at
  before insert or update on public.cms
  for each row execute function public.set_updated_at();

-- =========================================================
-- FACULTATIF — Verrouiller encore plus l'admin
-- ---------------------------------------------------------
-- Les blocs ci-dessous sont désactivés par défaut. Vous pouvez
-- les activer plus tard pour durcir la sécurité :

-- Interdire les inscriptions publiques si vous ne voulez pas de
-- comptes clients :
--   Dans Supabase → Authentication → Providers :
--   décochez « Email » → « Allow new users to sign up ».
-- =========================================================
