import type { UUID } from "crypto"
import type { Nullable } from "primereact/ts-helpers"
import type { User } from "../../../types/User"

export type BasePatient = {
  firstName: string
  lastName: string
  gender: string | number
  dateOfBirth: Nullable<Date> | string
}

export type PatientRequest = BasePatient & {
  user: User
}

export type PatientResponse = BasePatient & {
  id: UUID
}
