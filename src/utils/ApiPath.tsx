export const API_URL = import.meta.env.VITE_API_URL as string

export enum BASE_PATH {
  clinic = "clinics",
  clinicAdministration = "clinicadministrators",
  doctor = "doctors",
  study = "medicaltests",
  speciality = "medicalspecialties",
  patient = "patients",
}
