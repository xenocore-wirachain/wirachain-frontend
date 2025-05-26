import type { UUID } from "crypto"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import { useGetAllMedicalConsultationOfPatientQuery } from "../../../redux"

export const useAppointmentHook = () => {
  const baseHook = useDataTableHook()
  const idPatient = "550e8400-e29b-41d4-a716-446655440000" as UUID

  const { data, isLoading } = useGetAllMedicalConsultationOfPatientQuery({
    idPatient: idPatient,
    pagination: {
      page: baseHook.page,
      pageSize: baseHook.pageSize,
      search: baseHook.search,
    },
  })

  return {
    ...baseHook,

    data,
    isLoading,
  }
}
