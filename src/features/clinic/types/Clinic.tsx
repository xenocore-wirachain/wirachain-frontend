import type { UUID } from "crypto"
import type { Nullable } from "primereact/ts-helpers"
import type { User } from "../../../types/User"

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
  user: User
}

export type ClinicRequest = BaseClinic & {
  administratorId: UUID
}

export type ClinicResponse = BaseClinic & {
  id: number
  administration: Administator
}
