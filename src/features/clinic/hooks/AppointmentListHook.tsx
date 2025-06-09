import { useDataTableHook } from "../../../hooks/DataTableHook"
import { useGetAllMedicalConsultationOfClinicQuery } from "../../../redux"
import { useAuth } from "../../auth/hooks/UseAuth"

export const useAppointmentListHook = () => {
  const baseHook = useDataTableHook()
  const { userId } = useAuth()

  if (!userId) {
    throw new Error("User ID is required for clinic admin operations")
  }
  const idAdminClinic = userId

  const { data, isLoading, isFetching } =
    useGetAllMedicalConsultationOfClinicQuery({
      id: idAdminClinic,
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
    isFetching,
  }
}
