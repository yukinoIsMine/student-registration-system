import { z } from "zod";

export const applicationSchema = z.object({
  full_name: z.string().min(2, "Full name is required"),
  date_of_birth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  nrc_or_passport: z.string().min(3, "NRC or passport is required"),
  phone: z.string().min(5, "Phone number is required"),
  address: z.string().min(5, "Address is required"),
  previous_school: z.string().min(2, "Previous school is required"),
  guardian_name: z.string().min(2, "Guardian name is required"),
  guardian_phone: z.string().min(5, "Guardian phone is required"),
  program_id: z.string().uuid("Program selection is required"),
});

export type ApplicationFormValues = z.infer<typeof applicationSchema>;

export const requiredDocumentTypes = [
  { value: "photo", label: "Applicant photo" },
  { value: "nrc_or_passport", label: "NRC or passport" },
  { value: "certificate", label: "Previous school certificate" },
  { value: "transcript", label: "Transcript or exam result" },
];
