create table messages (
  id uuid primary key default uuid_generate_v4(),
  parent_id uuid references messages(id),
  conversation_id uuid, -- Just the column, no reference
  original_message text,
  edited_message text,
  version int not null default 1,
  created_at timestamp default now(),
  updated_at timestamp
);

create table branches (
  id uuid primary key default uuid_generate_v4(),
  message_id uuid references messages(id),
  branch_message text,
  conversation_id uuid, -- Just the column, no reference
  created_at timestamp default now()
);



CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL, -- Ensure password hashing
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL, -- FK to users table
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  title TEXT,
  last_message TIMESTAMP
);
