import type { UUID } from "crypto"
import type { Nullable } from "primereact/ts-helpers"
import type { User } from "./User"

export type ClinicAdminRequest = {
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: Nullable<Date> | string
  user: User
}

export type ClinicAdminResponse = {
  userId: UUID
  id: UUID
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: Date
}
