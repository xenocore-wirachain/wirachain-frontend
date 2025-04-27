import type { UUID } from "crypto"

export type BaseClinic = {
  ruc: string
  name: string
  address: string
}

export type ClinicRequest = BaseClinic & {
  administratorId: UUID
}

export type ClinicResponse = BaseClinic & {
  id: number
}
