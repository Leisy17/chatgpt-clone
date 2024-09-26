-- Messages table to store the original and edited messages
create table messages (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references messages(id),
  original_message text,
  edited_message text,
  version int not null default 1,
  created_at timestamp default now(),
  updated_at timestamp
);

-- Branches table to track follow-up messages for each branch
create table branches (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references messages(id),
  branch_message text,
  created_at timestamp default now()
);
