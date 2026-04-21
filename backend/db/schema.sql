-- gyms table
create table gyms (
  id bigint generated always as identity primary key,
  name text not null unique,
  location text,
  created_at timestamptz default now()
);

-- equipment table
create table equipment (
  id bigint generated always as identity primary key,
  gym_id bigint not null references gyms(id) on delete cascade,
  name text not null,
  type text not null,
  location text,
  description text,
  quantity integer not null default 1 check (quantity >= 0),
  created_at timestamptz default now()
);
