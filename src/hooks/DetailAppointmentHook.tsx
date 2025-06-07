import type { UUID } from "crypto"
import { useGetMedicalConsultationQuery } from "../redux"

export const useDetailAppointmentHook = (idAppointment: UUID) => {
  const { data: AppoimentData } = useGetMedicalConsultationQuery(idAppointment)

  return {
    AppoimentData,
  }
}
