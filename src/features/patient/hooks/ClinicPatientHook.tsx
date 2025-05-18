import type { UUID } from "crypto"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import {
  useAddClinicPatientMutation,
  useGetAllClinicsPerPatientQuery,
  useRemoveClinicPatientMutation,
} from "../../../redux"

export const useClinicPatientHook = () => {
  const baseHook = useDataTableHook()
  const idPatient = "dcf5afba-0960-449f-b967-9972af646ce2" as UUID

  const { data, isLoading, isFetching } = useGetAllClinicsPerPatientQuery({
    pagination: {
      page: baseHook.page,
      pageSize: baseHook.pageSize,
      search: baseHook.search,
    },
    idPatient: idPatient,
  })

  const [createClinicPatient, { isLoading: isCreating }] =
    useAddClinicPatientMutation()
  const [deleteClinicPatient, { isLoading: isDeleting }] =
    useRemoveClinicPatientMutation()

  const handleCreateSubmit = (idClinic: number) => {
    void createClinicPatient({
      clinicId: idClinic,
      patientId: idPatient,
    })
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess("Éxito", "Vinculado con exito")
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  const handleRemoveSubmit = (idClinic: number) => {
    void deleteClinicPatient({
      clinicId: idClinic,
      patientId: idPatient,
    })
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess("Éxito", "Desvinculado con exito")
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  return {
    ...baseHook,

    data,
    isLoading,
    isFetching,
    isCreating,
    isDeleting,

    handleCreateSubmit,
    handleRemoveSubmit,
  }
}
