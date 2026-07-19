-- Rota Psikoteknik - Supabase şema kurulumu
-- Bu dosyanın tamamını Supabase Dashboard > SQL Editor içine yapıştırıp "Run" tuşuna basın.

create table if not exists appointments (
  id bigint generated always as identity primary key,
  date date not null,
  slot text not null,
  client_name text not null,
  phone text,
  service text,
  price numeric not null default 0,
  pay_status text not null default 'bekliyor',
  paid_amount numeric,
  note text,
  document_issued boolean not null default false,
  issue_date date,
  expiry_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (date, slot)
);

create table if not exists settings (
  id int primary key default 1,
  start_hour int not null default 9,
  end_hour int not null default 18,
  step_min int not null default 45,
  validity_years int not null default 5,
  reminder_window_days int not null default 60,
  constraint single_row check (id = 1)
);

insert into settings (id) values (1) on conflict (id) do nothing;

-- Basitlik için Row Level Security kapalı bırakılıyor (tek kullanıcılı, anon key ile).
-- Uygulamayı halka açık bir adrese koyacaksanız, aşağıdaki adımı okuyun:
-- README.md içindeki "Güvenlik" bölümüne bakın.
alter table appointments enable row level security;
alter table settings enable row level security;

create policy "allow all appointments" on appointments
  for all using (true) with check (true);

create policy "allow all settings" on settings
  for all using (true) with check (true);
