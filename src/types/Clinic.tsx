import type { User } from "./User"

export type Clinic = User & {
  ruc: number
  address: string
}
