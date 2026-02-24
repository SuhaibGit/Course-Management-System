-- Create courses table
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  title text not null,
  description text not null,
  instructor text not null,
  price numeric not null default 0,
  user_id uuid references auth.users not null on delete cascade
);

-- Enable RLS
alter table public.courses enable row level security;

-- Policies
create policy "Courses are viewable by everyone" 
  on public.courses for select 
  using (true);

create policy "Users can insert their own courses" 
  on public.courses for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own courses" 
  on public.courses for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own courses" 
  on public.courses for delete 
  using (auth.uid() = user_id);
