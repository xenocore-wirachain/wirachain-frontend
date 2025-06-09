import type { UUID } from "crypto"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import { useGetAllMedicalConsultationOfPatientQuery } from "../../../redux"

export const usePatientDetailHook = (idPatient: UUID) => {
  const baseHook = useDataTableHook()
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
