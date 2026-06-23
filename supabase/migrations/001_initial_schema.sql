create extension if not exists "pgcrypto";

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  role text not null default 'applicant' check (role in ('applicant', 'reviewer', 'admin')),
  created_at timestamptz not null default now()
);

create table public.departments (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  code text unique,
  created_at timestamptz not null default now()
);

create table public.programs (
  id uuid primary key default gen_random_uuid(),
  department_id uuid references public.departments(id) on delete set null,
  name text not null,
  degree_level text,
  duration_years int check (duration_years is null or duration_years > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.admission_periods (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  start_date date not null,
  end_date date not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  check (end_date >= start_date)
);

create unique index one_active_admission_period
on public.admission_periods (is_active)
where is_active;

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  application_no text unique,
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  program_id uuid references public.programs(id) on delete set null,
  admission_period_id uuid references public.admission_periods(id) on delete set null,
  full_name text not null,
  date_of_birth date,
  gender text,
  nrc_or_passport text,
  phone text,
  address text,
  previous_school text,
  guardian_name text,
  guardian_phone text,
  status text not null default 'draft' check (status in ('draft', 'submitted', 'under_review', 'accepted', 'rejected')),
  review_note text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index one_application_per_period
on public.applications (applicant_id, admission_period_id)
where admission_period_id is not null;

create table public.application_documents (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  applicant_id uuid not null references public.profiles(id) on delete cascade,
  document_type text not null check (document_type in ('photo', 'nrc_or_passport', 'certificate', 'transcript')),
  file_name text not null,
  file_path text not null,
  file_size bigint,
  mime_type text,
  created_at timestamptz not null default now()
);

create table public.student_records (
  id uuid primary key default gen_random_uuid(),
  student_no text unique,
  application_id uuid unique not null references public.applications(id) on delete restrict,
  profile_id uuid not null references public.profiles(id) on delete restrict,
  program_id uuid references public.programs(id) on delete set null,
  enrolled_at timestamptz not null default now(),
  status text not null default 'active' check (status in ('active', 'inactive'))
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger set_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.email,
    'applicant'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

create or replace function public.has_role(required_role text)
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role = required_role
  );
$$;

create or replace function public.is_staff()
returns boolean
language sql
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid()
      and role in ('reviewer', 'admin')
  );
$$;

create or replace function public.random_code(prefix text)
returns text
language sql
as $$
  select prefix || '-' || extract(year from now())::text || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));
$$;

create or replace function public.submit_application(application_id_input uuid)
returns public.applications
language plpgsql
security definer
set search_path = public
as $$
declare
  target_application public.applications;
  required_count int;
begin
  select *
  into target_application
  from public.applications
  where id = application_id_input
    and applicant_id = auth.uid()
    and status = 'draft'
  for update;

  if not found then
    raise exception 'Draft application not found or cannot be submitted.';
  end if;

  if target_application.program_id is null
    or target_application.date_of_birth is null
    or coalesce(target_application.nrc_or_passport, '') = ''
    or coalesce(target_application.phone, '') = ''
    or coalesce(target_application.address, '') = ''
    or coalesce(target_application.previous_school, '') = ''
    or coalesce(target_application.guardian_name, '') = ''
    or coalesce(target_application.guardian_phone, '') = '' then
    raise exception 'Complete all required fields before submitting.';
  end if;

  select count(distinct document_type)
  into required_count
  from public.application_documents
  where application_id = application_id_input
    and applicant_id = auth.uid()
    and document_type in ('photo', 'nrc_or_passport', 'certificate', 'transcript');

  if required_count < 4 then
    raise exception 'Upload all required documents before submitting.';
  end if;

  update public.applications
  set status = 'submitted',
      submitted_at = now(),
      application_no = coalesce(application_no, public.random_code('APP'))
  where id = application_id_input
  returning * into target_application;

  return target_application;
end;
$$;

create or replace function public.review_application(
  application_id_input uuid,
  decision_input text,
  review_note_input text default null
)
returns public.applications
language plpgsql
security definer
set search_path = public
as $$
declare
  target_application public.applications;
begin
  if not public.is_staff() then
    raise exception 'Only reviewers and admins can review applications.';
  end if;

  if decision_input not in ('accepted', 'rejected') then
    raise exception 'Decision must be accepted or rejected.';
  end if;

  select *
  into target_application
  from public.applications
  where id = application_id_input
    and status in ('submitted', 'under_review')
  for update;

  if not found then
    raise exception 'Application is not ready for review.';
  end if;

  update public.applications
  set status = decision_input,
      review_note = review_note_input,
      reviewed_at = now(),
      reviewed_by = auth.uid()
  where id = application_id_input
  returning * into target_application;

  if decision_input = 'accepted' then
    insert into public.student_records (student_no, application_id, profile_id, program_id)
    values (
      public.random_code('STU'),
      target_application.id,
      target_application.applicant_id,
      target_application.program_id
    )
    on conflict (application_id) do nothing;
  end if;

  return target_application;
end;
$$;

alter table public.profiles enable row level security;
alter table public.departments enable row level security;
alter table public.programs enable row level security;
alter table public.admission_periods enable row level security;
alter table public.applications enable row level security;
alter table public.application_documents enable row level security;
alter table public.student_records enable row level security;

create policy "Users can view own profile"
on public.profiles for select
to authenticated
using (id = auth.uid());

create policy "Users can update own profile"
on public.profiles for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

create policy "Staff can view profiles"
on public.profiles for select
to authenticated
using (public.is_staff());

create policy "Anyone can view departments"
on public.departments for select
to anon, authenticated
using (true);

create policy "Admins can manage departments"
on public.departments for all
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Anyone can view active programs"
on public.programs for select
to anon, authenticated
using (is_active = true or public.has_role('admin'));

create policy "Admins can manage programs"
on public.programs for all
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Anyone can view active admission periods"
on public.admission_periods for select
to anon, authenticated
using (is_active = true or public.has_role('admin'));

create policy "Admins can manage admission periods"
on public.admission_periods for all
to authenticated
using (public.has_role('admin'))
with check (public.has_role('admin'));

create policy "Applicants can view own applications"
on public.applications for select
to authenticated
using (applicant_id = auth.uid());

create policy "Applicants can create own draft applications"
on public.applications for insert
to authenticated
with check (applicant_id = auth.uid() and status = 'draft');

create policy "Applicants can update own draft applications"
on public.applications for update
to authenticated
using (applicant_id = auth.uid() and status = 'draft')
with check (applicant_id = auth.uid() and status = 'draft');

create policy "Staff can view all applications"
on public.applications for select
to authenticated
using (public.is_staff());

create policy "Staff can update applications"
on public.applications for update
to authenticated
using (public.is_staff())
with check (public.is_staff());

create policy "Applicants can view own document metadata"
on public.application_documents for select
to authenticated
using (applicant_id = auth.uid());

create policy "Applicants can insert own document metadata"
on public.application_documents for insert
to authenticated
with check (
  applicant_id = auth.uid()
  and exists (
    select 1
    from public.applications
    where applications.id = application_id
      and applications.applicant_id = auth.uid()
      and applications.status = 'draft'
  )
);

create policy "Staff can view all document metadata"
on public.application_documents for select
to authenticated
using (public.is_staff());

create policy "Applicants can view own student record"
on public.student_records for select
to authenticated
using (profile_id = auth.uid());

create policy "Staff can view all student records"
on public.student_records for select
to authenticated
using (public.is_staff());

create policy "Staff can create student records"
on public.student_records for insert
to authenticated
with check (public.is_staff());

insert into storage.buckets (id, name, public)
values ('application-documents', 'application-documents', false)
on conflict (id) do nothing;

create policy "Applicants can upload own files"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'application-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Applicants can view own files"
on storage.objects for select
to authenticated
using (
  bucket_id = 'application-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create policy "Staff can view application documents"
on storage.objects for select
to authenticated
using (
  bucket_id = 'application-documents'
  and public.is_staff()
);
