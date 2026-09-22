-- ============================================================================
-- XPASS FITNESS ECOSYSTEM - DATABASE SCHEMA (SUPABASE / POSTGRESQL)
-- ECAPX Engineering Standard
-- ============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PROFILES TABLE (Alunos, Parceiros e Admins)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  name text not null default 'Aluno XPASS',
  credits integer not null default 120 check (credits >= 0),
  role text not null default 'student' check (role in ('student', 'partner', 'admin')),
  plan text not null default 'Black Diamond',
  referral_code text unique default ('XPASS-' || substring(gen_random_uuid()::text, 1, 6)),
  avatar_url text default 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 3. STUDIOS TABLE (Academias e Boxes Parceiros)
create table if not exists public.studios (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  rating numeric(3, 1) default 4.8,
  distance text default '1.0 km',
  image_url text not null,
  credit_cost integer not null default 15 check (credit_cost > 0),
  is_open boolean not null default true,
  address text,
  description text,
  amenities text[] default '{}',
  owner_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

-- 4. CLASSES TABLE (Grade de Aulas e Modalidades)
create table if not exists public.classes (
  id uuid primary key default gen_random_uuid(),
  studio_id uuid references public.studios(id) on delete cascade not null,
  title text not null,
  description text,
  time text not null,
  duration text default '60min',
  instructor text default 'Coach XPASS',
  spots integer not null default 15,
  booked integer not null default 0,
  created_at timestamptz not null default now()
);

-- 5. BOOKINGS TABLE (Agendamentos e Check-ins)
create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  class_id uuid references public.classes(id) on delete set null,
  studio_id uuid references public.studios(id) on delete cascade not null,
  studio_name text not null,
  credit_cost integer not null default 15,
  booking_date date not null default current_date,
  booking_time text not null default '18:00',
  status text not null default 'confirmed' check (status in ('confirmed', 'checked_in', 'cancelled')),
  created_at timestamptz not null default now()
);

-- 6. TRANSACTIONS TABLE (Histórico Financeiro e de Créditos)
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in ('recharge', 'booking', 'refund', 'subscription', 'payout')),
  amount_credits integer default 0,
  amount_brl numeric(10, 2) default 0.00,
  description text not null,
  status text not null default 'completed' check (status in ('completed', 'pending', 'dispute')),
  created_at timestamptz not null default now()
);

-- ============================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

alter table public.profiles enable row level security;
alter table public.studios enable row level security;
alter table public.classes enable row level security;
alter table public.bookings enable row level security;
alter table public.transactions enable row level security;

-- PROFILES: Qualquer um lê seu próprio perfil; leitura pública de nome/avatar
create policy "Public profiles are viewable by everyone" 
  on public.profiles for select using (true);

create policy "Users can update their own profile" 
  on public.profiles for update using (auth.uid() = id);

-- STUDIOS: Leitura pública para todos os visitantes
create policy "Studios are viewable by everyone" 
  on public.studios for select using (true);

create policy "Studio owners can modify their studio" 
  on public.studios for all using (auth.uid() = owner_id);

-- CLASSES: Leitura pública para todos
create policy "Classes are viewable by everyone" 
  on public.classes for select using (true);

create policy "Studio owners can manage classes" 
  on public.classes for all using (
    exists (select 1 from public.studios where studios.id = classes.studio_id and studios.owner_id = auth.uid())
  );

-- BOOKINGS: Usuários veem e criam suas próprias reservas
create policy "Users can view their own bookings" 
  on public.bookings for select using (auth.uid() = user_id);

create policy "Users can insert their own bookings" 
  on public.bookings for insert with check (auth.uid() = user_id);

create policy "Studio owners can view bookings for their studio" 
  on public.bookings for select using (
    exists (select 1 from public.studios where studios.id = bookings.studio_id and studios.owner_id = auth.uid())
  );

create policy "Studio owners can update booking status (check-in)" 
  on public.bookings for update using (
    exists (select 1 from public.studios where studios.id = bookings.studio_id and studios.owner_id = auth.uid())
  );

-- TRANSACTIONS: Usuário vê seu histórico
create policy "Users can view their own transactions" 
  on public.transactions for select using (auth.uid() = user_id);

-- ============================================================================
-- 8. TRIGGER: AUTO CREATE PROFILE ON SIGNUP
-- ============================================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, name, avatar_url, credits, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'avatar_url', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'),
    120,
    'student'
  )
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================================================
-- 9. SEED INITIAL STUDIOS
-- ============================================================================

insert into public.studios (name, category, rating, distance, image_url, credit_cost, is_open, address, description, amenities)
values 
  (
    'Iron Forge Gym',
    'Musculação',
    4.8,
    '0.8 km',
    'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=600&auto=format&fit=crop',
    15,
    true,
    'Av. Paulista, 1000 - Bela Vista',
    'Equipamentos biomecânicos de ponta, pesos livres e vestiários premium com sauna.',
    array['Estacionamento', 'Chuveiro', 'Wi-Fi', 'Armários']
  ),
  (
    'Quantum Pilates',
    'Pilates',
    4.9,
    '1.2 km',
    'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=600&auto=format&fit=crop',
    25,
    true,
    'Rua Oscar Freire, 850 - Jardins',
    'Estúdio boutique com aparelhos Cadillac e Reformer para postura e fortalecimento profundo.',
    array['Turmas Reduzidas', 'Toalhas Cortesia', 'Água Alcalina']
  ),
  (
    'Velocity Crossfit',
    'CrossFit',
    4.7,
    '2.5 km',
    'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    30,
    false,
    'Rua Funchal, 418 - Vila Olímpia',
    'Box oficial com piso de absorção de impacto, barras olímpicas e coaches certificados.',
    array['Vestiário Completo', 'Recovery Zone', 'Estacionamento']
  ),
  (
    'Aqua Blue Center',
    'Natação',
    4.6,
    '3.0 km',
    'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=600&auto=format&fit=crop',
    20,
    true,
    'Rua Pamplona, 1400 - Jardim Paulista',
    'Piscina semi-olímpica aquecida tratada com ozônio para treinos de natação e hidroginástica.',
    array['Piscina Aquecida', 'Ozônio', 'Vestiários Térmicos']
  ),
  (
    'Fight Club MMA',
    'Artes Marciais',
    5.0,
    '4.2 km',
    'https://images.unsplash.com/photo-1549719386-74dfcbf7dbed?q=80&w=600&auto=format&fit=crop',
    22,
    true,
    'Rua Augusta, 2200 - Consolação',
    'Tatames profissionais, octógono oficial e aulas de Muay Thai, Boxe e Jiu-Jitsu.',
    array['Octógono', 'Sacos de Pancada', 'Chuveiros']
  )
on conflict do nothing;
