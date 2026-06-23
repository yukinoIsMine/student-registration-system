insert into public.departments (name, code)
values
  ('Computer Engineering', 'COE'),
  ('Information Technology', 'IT'),
  ('Business Administration', 'BA')
on conflict (code) do nothing;

insert into public.programs (department_id, name, degree_level, duration_years, is_active)
select id, 'B.E. Computer Engineering', 'Bachelor', 5, true
from public.departments
where code = 'COE'
on conflict do nothing;

insert into public.programs (department_id, name, degree_level, duration_years, is_active)
select id, 'B.Sc. Information Technology', 'Bachelor', 4, true
from public.departments
where code = 'IT'
on conflict do nothing;

insert into public.programs (department_id, name, degree_level, duration_years, is_active)
select id, 'B.B.A. Business Administration', 'Bachelor', 4, true
from public.departments
where code = 'BA'
on conflict do nothing;

insert into public.admission_periods (name, start_date, end_date, is_active)
values ('2026-2027 Admission', '2026-07-01', '2026-08-31', true)
on conflict do nothing;
