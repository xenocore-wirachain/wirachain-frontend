import type { Nullable } from "primereact/ts-helpers"

export type User = {
  name?: string
  phone: string
  email: string
  password?: string
}

export type BaseUser = {
  firstName: string
  lastName: string
  gender: string | number
  dateOfBirth: Nullable<Date> | string
}

export type RequestUser = BaseUser & {
  user: User
}
