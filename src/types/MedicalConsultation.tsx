import type { UUID } from "crypto"
import type { Nullable } from "primereact/ts-helpers"

export type MedicalConsultationResponseDoctorAndClinic = {
  id: UUID
  description: string
  consultationDate: string
}

export type MedicalConsultationRequest = {
  idPatient: UUID | null
  visitReason: string
  dateOfBirth: Nullable<Date> | string
  consultationDate: Nullable<Date> | string
  notes: string
  checkInTime: string
  checkOutTime: string
}
