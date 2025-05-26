import type { UUID } from "crypto"

export type MedicalConsultationResponseDoctorAndClinic = {
  id: UUID
  description: string
  consultationDate: string
}
