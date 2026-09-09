-- Run this once in Supabase: your project → SQL Editor → New query → paste this → Run

create table if not exists profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  credits integer not null default 3,
  created_at timestamp with time zone default now()
);

alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

-- Automatically gives every new signup 3 free credits
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, credits)
  values (new.id, new.email, 3);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
