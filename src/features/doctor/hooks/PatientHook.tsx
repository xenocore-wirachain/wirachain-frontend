import { useDataTableHook } from "../../../hooks/DataTableHook"
import { useGetPatientsPerClinicQuery } from "../../../redux"

export const usePatientHook = () => {
  const baseHook = useDataTableHook()
  const storeOption = localStorage.getItem("choosen_clinic")
  const idClinic = storeOption ? (JSON.parse(storeOption) as number) : 0

  const { data: patientData, isLoading: isLoadingPatient } =
    useGetPatientsPerClinicQuery({
      idClinic: idClinic,
      pagination: {
        page: baseHook.page,
        pageSize: baseHook.pageSize,
        search: baseHook.search,
      },
    })

  return {
    ...baseHook,

    // Variables
    patientData,
    isLoadingPatient,
  }
}
