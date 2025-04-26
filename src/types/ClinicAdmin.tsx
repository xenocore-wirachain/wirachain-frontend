import type { UUID } from "crypto"
import type { User } from "./User"

type Gender = "male" | "female"

export type ClinicAdminRequest = {
  firstName: string
  lastName: string
  gender: Gender
  dateOfBirth: Date | string
  user: User
}

export type ClinicAdminResponse = {
  userId: UUID
  id: UUID
  firstName: string
  lastName: string
  gender: Gender
  dateOfBirth: Date
}
