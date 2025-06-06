import type { UUID } from "crypto"
import type { Nullable } from "primereact/ts-helpers"
import type { User } from "../../../types/User"
import type { StudyResponse } from "../../admin/types/Study"

export type BaseClinic = {
  ruc: string
  name: string
  address: string
}

export type Administator = {
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: Nullable<Date> | string
  user: User | null
}

export type ClinicRequest = BaseClinic & {
  administratorId: UUID
  medicalTestIds: number[]
}

export type ClinicResponse = BaseClinic & {
  id: number
  administrator: Administator
  medicalTests: StudyResponse[]
}
