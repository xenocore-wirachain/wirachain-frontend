import type { UUID } from "crypto"
import type { Nullable } from "primereact/ts-helpers"
import type { User } from "../../../types/User"

export type BaseClinic = {
  firstName: string
  lastName: string
  gender: string | number
  dateOfBirth: Nullable<Date> | string
}

export type ClinicAdminRequest = BaseClinic & {
  user: User
}

export type ClinicAdminResponse = BaseClinic & {
  userId: UUID
  id: UUID
}

export type ClinicAdminDetail = BaseClinic &
  User & {
    id: UUID
    userId: UUID
  }
