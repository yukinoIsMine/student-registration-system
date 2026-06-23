export type ProfileRole = "applicant" | "reviewer" | "admin";
export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "accepted"
  | "rejected";

export type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: ProfileRole;
  created_at: string;
};

export type Department = {
  id: string;
  name: string;
  code: string | null;
  created_at: string;
};

export type Program = {
  id: string;
  department_id: string | null;
  name: string;
  degree_level: string | null;
  duration_years: number | null;
  is_active: boolean;
  created_at: string;
  departments?: Pick<Department, "name" | "code"> | null;
};

export type AdmissionPeriod = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  created_at: string;
};

export type Application = {
  id: string;
  application_no: string | null;
  applicant_id: string;
  program_id: string | null;
  admission_period_id: string | null;
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  nrc_or_passport: string | null;
  phone: string | null;
  address: string | null;
  previous_school: string | null;
  guardian_name: string | null;
  guardian_phone: string | null;
  status: ApplicationStatus;
  review_note: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  created_at: string;
  updated_at: string;
  programs?: Pick<Program, "name" | "degree_level"> | null;
  profiles?: Pick<Profile, "full_name" | "email"> | null;
};

export type ApplicationDocument = {
  id: string;
  application_id: string;
  applicant_id: string;
  document_type: string;
  file_name: string;
  file_path: string;
  file_size: number | null;
  mime_type: string | null;
  created_at: string;
};

export type StudentRecord = {
  id: string;
  student_no: string | null;
  application_id: string;
  profile_id: string;
  program_id: string | null;
  enrolled_at: string;
  status: "active" | "inactive";
};
