import type { UUID } from "crypto"

type BaseClinicPatient = {
  id: number
  ruc: string
  address: string
  name: string
}

export type ClinicPatientResponse = BaseClinicPatient & {
  isActive: boolean
  isRequired: boolean
}

export type AddClinicPatientRequest = {
  patientId: UUID
  clinicId: number
}

export type AddClinicpatientResponse = {
  message: string
}
