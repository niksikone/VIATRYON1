-- Add wrist_size_mm column to vto_sessions table
-- This stores the user's wrist circumference in millimeters for custom sizing

alter table public.vto_sessions
add column if not exists wrist_size_mm integer;

comment on column public.vto_sessions.wrist_size_mm is 'User wrist circumference in millimeters (45-75mm range)';
