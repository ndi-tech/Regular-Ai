create extension if not exists "uuid-ossp";
create extension if not exists "pgcrypto";

create table public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null, industry text, country text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade unique,
  organization_id uuid references public.organizations(id) on delete set null,
  full_name text, role text default 'member',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index profiles_org_idx on public.profiles(organization_id);

create table public.business_profiles (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade unique,
  industry text, countries text[] default '{}',
  business_activities text[] default '{}',
  employee_count text, products_services text,
  compliance_areas text[] default '{}',
  departments text[] default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.regulatory_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null, country text, jurisdiction text,
  source_url text, source_type text default 'manual',
  active boolean not null default true,
  last_checked_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.regulatory_documents (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  source_id uuid references public.regulatory_sources(id) on delete set null,
  title text not null, description text,
  source_url text, document_url text, document_path text,
  jurisdiction text, publication_date date, effective_date date,
  status text not null default 'unanalyzed',
  raw_text text, analysis jsonb,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index documents_org_idx on public.regulatory_documents(organization_id);

create table public.regulatory_changes (
  id uuid primary key default gen_random_uuid(),
  document_id uuid not null references public.regulatory_documents(id) on delete cascade,
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null, summary text, change_type text,
  effective_date date, source_reference text, ai_analysis jsonb,
  created_at timestamptz not null default now()
);
create index changes_org_idx on public.regulatory_changes(organization_id);

create table public.impact_assessments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  regulatory_change_id uuid not null references public.regulatory_changes(id) on delete cascade,
  impact_level text not null default 'medium',
  affected_processes text[] default '{}',
  affected_departments text[] default '{}',
  reasoning text, recommended_actions text[] default '{}',
  ai_confidence numeric, ai_raw jsonb,
  human_review_status text not null default 'pending',
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz, review_notes text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);
create index assessments_org_idx on public.impact_assessments(organization_id);

create table public.compliance_tasks (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  impact_assessment_id uuid references public.impact_assessments(id) on delete set null,
  title text not null, description text, department text,
  priority text not null default 'medium',
  status text not null default 'not_started',
  assigned_to uuid references auth.users(id) on delete set null,
  due_date date, completed_at timestamptz,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index tasks_org_idx on public.compliance_tasks(organization_id);

create table public.evidence (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  task_id uuid references public.compliance_tasks(id) on delete set null,
  file_path text not null, file_name text not null,
  file_size integer, mime_type text, description text,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null, entity_type text, entity_id uuid,
  metadata jsonb default '{}',
  created_at timestamptz not null default now()
);
create index audit_org_idx on public.audit_logs(organization_id);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  title text not null, body text, link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

create or replace function public.touch_updated_at()
returns trigger as $$ begin new.updated_at = now(); return new; end; $$ language plpgsql;

do $$ declare t text; begin
  foreach t in array array['organizations','profiles','business_profiles','regulatory_documents','compliance_tasks']
  loop
    execute format('create trigger set_updated_at before update on public.%I for each row execute procedure public.touch_updated_at();', t);
  end loop;
end $$;

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (user_id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', new.email));
  return new;
end; $$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

create or replace function public.current_org_id()
returns uuid as $$
  select organization_id from public.profiles where user_id = auth.uid()
$$ language sql stable security definer;

alter table public.organizations        enable row level security;
alter table public.profiles             enable row level security;
alter table public.business_profiles    enable row level security;
alter table public.regulatory_sources   enable row level security;
alter table public.regulatory_documents enable row level security;
alter table public.regulatory_changes   enable row level security;
alter table public.impact_assessments   enable row level security;
alter table public.compliance_tasks     enable row level security;
alter table public.evidence             enable row level security;
alter table public.audit_logs           enable row level security;
alter table public.notifications        enable row level security;

create policy org_select on public.organizations for select using (id = public.current_org_id());
create policy org_update on public.organizations for update using (id = public.current_org_id());
create policy org_insert on public.organizations for insert with check (auth.uid() is not null);

create policy prof_select on public.profiles for select using (user_id = auth.uid() or organization_id = public.current_org_id());
create policy prof_update_self on public.profiles for update using (user_id = auth.uid());
create policy prof_insert_self on public.profiles for insert with check (user_id = auth.uid());

create policy bp_all on public.business_profiles for all using (organization_id = public.current_org_id()) with check (organization_id = public.current_org_id());
create policy src_read on public.regulatory_sources for select using (auth.uid() is not null);
create policy docs_all on public.regulatory_documents for all using (organization_id = public.current_org_id()) with check (organization_id = public.current_org_id());
create policy chg_all on public.regulatory_changes for all using (organization_id = public.current_org_id()) with check (organization_id = public.current_org_id());
create policy asm_all on public.impact_assessments for all using (organization_id = public.current_org_id()) with check (organization_id = public.current_org_id());
create policy tsk_all on public.compliance_tasks for all using (organization_id = public.current_org_id()) with check (organization_id = public.current_org_id());
create policy evd_all on public.evidence for all using (organization_id = public.current_org_id()) with check (organization_id = public.current_org_id());
create policy audit_read on public.audit_logs for select using (organization_id = public.current_org_id());
create policy notif_self on public.notifications for all using (user_id = auth.uid()) with check (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values ('regulatory-documents','regulatory-documents',false),('evidence','evidence',false)
on conflict (id) do nothing;

create policy "org can read own regulatory docs" on storage.objects for select using (bucket_id = 'regulatory-documents' and (storage.foldername(name))[1] = public.current_org_id()::text);
create policy "org can upload own regulatory docs" on storage.objects for insert with check (bucket_id = 'regulatory-documents' and (storage.foldername(name))[1] = public.current_org_id()::text);
create policy "org can delete own regulatory docs" on storage.objects for delete using (bucket_id = 'regulatory-documents' and (storage.foldername(name))[1] = public.current_org_id()::text);
create policy "org can read own evidence" on storage.objects for select using (bucket_id = 'evidence' and (storage.foldername(name))[1] = public.current_org_id()::text);
create policy "org can upload own evidence" on storage.objects for insert with check (bucket_id = 'evidence' and (storage.foldername(name))[1] = public.current_org_id()::text);
create policy "org can delete own evidence" on storage.objects for delete using (bucket_id = 'evidence' and (storage.foldername(name))[1] = public.current_org_id()::text);