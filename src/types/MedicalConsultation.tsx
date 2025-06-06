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
  nextAppointmentDate: Nullable<Date> | string
  notes: string
  checkInTime: Nullable<Date> | string
  checkOutTime: Nullable<Date> | string
  medicalTestIds: number[]
}
