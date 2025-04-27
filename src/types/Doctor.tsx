import type { UUID } from "crypto"
import type { Nullable } from "primereact/ts-helpers"
import type { User } from "./User"

export type BaseDoctor = {
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: Nullable<Date> | string
}

export type DoctorRequest = BaseDoctor & {
  user: User
}

export type DoctorResponse = BaseDoctor & {
  id: UUID
}

export type DoctorDetailedResponse = DoctorResponse & {
  userId: UUID
  user: UUID | null
  identifiers: unknown
  updatedAt: string
  createdAt: string
}
