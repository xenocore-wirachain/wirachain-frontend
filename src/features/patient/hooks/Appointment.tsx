import { useDataTableHook } from "../../../hooks/DataTableHook"
import { useGetAllMedicalConsultationOfPatientQuery } from "../../../redux"
import { useAuth } from "../../auth/hooks/UseAuth"

export const useAppointmentHook = () => {
  const baseHook = useDataTableHook()
  const { userId } = useAuth()

  if (!userId) {
    throw new Error("User ID is required")
  }
  const idPatient = userId

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
