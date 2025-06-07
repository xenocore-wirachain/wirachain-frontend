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
  checkInDateTime: Nullable<Date> | string
  checkOutDateTime: Nullable<Date> | string
  medicalTestIds: number[]
}

export type MedicalConsultationResponse = {
  id: UUID
  notes: string
  checkInDateTime: Nullable<Date> | string
  checkOutDateTime: Nullable<Date> | string
  durationTimeSpan: string
  doctorInCharge: {
    id: UUID
    firstName: string
    lastName: string
    gender: string | number
    dateOfBirth: Nullable<Date> | string
  }
  patient: {
    id: UUID
    firstName: string
    lastName: string
    gender: string | number
    dateOfBirth: Nullable<Date> | string
  }
  clinic: {
    id: number
    ruc: string
    name: string
    address: string
  }
}
