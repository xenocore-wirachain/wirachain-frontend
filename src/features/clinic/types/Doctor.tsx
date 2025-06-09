import type { UUID } from "crypto"
import type { Nullable } from "primereact/ts-helpers"
import type { User } from "../../../types/User"
import type { SpecialityResponse } from "../../admin/types/Speciality"

export type BaseDoctor = {
  firstName: string
  lastName: string
  gender: string
  dateOfBirth: Nullable<Date> | string
}

export type DoctorRequest = BaseDoctor & {
  user: User
  clinicIds: number[]
  medicalSpecialtyIds: number[]
}

export type DoctorResponse = BaseDoctor & {
  id: UUID
}

export type ClinicData = {
  id: number
  name: string
  ruc: string
  address: string
}

export type DoctorDetailedResponse = DoctorResponse & {
  phone: string
  email: string
  medicalSpecialties: SpecialityResponse[]
  clinics: ClinicData[]
}
