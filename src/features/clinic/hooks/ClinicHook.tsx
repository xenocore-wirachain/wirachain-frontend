import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import {
  useAddClinicMutation,
  useDeleteClinicMutation,
  useGetAllClinicsQuery,
  useGetClinicQuery,
  useUpdateClinicMutation,
} from "../../../redux"
import { useAuth } from "../../auth/hooks/UseAuth"
import type { ClinicRequest } from "../types/Clinic"
import ConverClinicResponseToClinicRequest from "../utils/ClinicDTO"

export const useClinicHook = () => {
  const baseHook = useDataTableHook()
  const { userId } = useAuth()

  if (!userId) {
    throw new Error("User ID is required for clinic admin operations")
  }
  const idAdminClinic = userId

  const defaultValues: ClinicRequest = {
    administratorId: idAdminClinic,
    ruc: "",
    name: "",
    address: "",
    medicalTestIds: [],
  }

  const { data, isLoading, isFetching } = useGetAllClinicsQuery({
    id: idAdminClinic,
    pagination: {
      page: baseHook.page,
      pageSize: baseHook.pageSize,
      search: baseHook.search,
    },
  })

  const { data: clinicData, isLoading: isLoadingClinic } = useGetClinicQuery(
    baseHook.idSelected as number,
    {
      skip:
        !baseHook.showUpdateDialog || typeof baseHook.idSelected !== "number",
    },
  )

  const [createClinic, { isLoading: isCreating }] = useAddClinicMutation()
  const [deleteClinic, { isLoading: isDeleting }] = useDeleteClinicMutation()
  const [updateClinic, { isLoading: isUpdating }] = useUpdateClinicMutation()

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ClinicRequest>({ defaultValues })

  const handleCreateSubmit = (data: ClinicRequest) => {
    void createClinic(data)
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess("Éxito", "Clinica creada correctamente")
        handleCloseForm()
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  const handleUpdateSubmit = (data: ClinicRequest) => {
    if (typeof baseHook.idSelected === "number") {
      void updateClinic({
        id: baseHook.idSelected,
        clinic: data,
      })
        .unwrap()
        .then(() => {
          baseHook.toast.showSuccess(
            "Éxito",
            "Clinica actualizada correctamente",
          )
          handleCloseForm()
        })
        .catch((error: unknown) => {
          baseHook.handleApiError(error)
        })
    } else {
      baseHook.handleIdError()
    }
  }

  const handleDeleteSubmit = () => {
    if (typeof baseHook.idSelected === "number") {
      void deleteClinic(baseHook.idSelected)
        .unwrap()
        .then(() => {
          baseHook.toast.showSuccess("Éxito", "Clinica eliminada correctamente")
          baseHook.closeAllDialogs()
        })
        .catch((error: unknown) => {
          baseHook.handleApiError(error)
        })
    } else {
      baseHook.handleIdError()
    }
  }

  const handleReceiveData = useCallback(() => {
    if (baseHook.showUpdateDialog && clinicData) {
      const transformedData = ConverClinicResponseToClinicRequest(
        clinicData,
        idAdminClinic,
      )
      reset(transformedData)
    }
  }, [baseHook.showUpdateDialog, clinicData, idAdminClinic, reset])

  const handleCloseForm = () => {
    baseHook.closeAllDialogs()
    reset(defaultValues)
  }

  const handleFormSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleCreateSubmit)(e as React.BaseSyntheticEvent)
  }

  const handleFormSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleUpdateSubmit)(e as React.BaseSyntheticEvent)
  }

  return {
    ...baseHook,

    // Data fetching
    data,
    isLoading,
    isFetching,
    isLoadingClinic,
    clinicData,

    // Form handling
    control,
    errors,
    isCreating,
    isDeleting,
    isUpdating,
    defaultValues,

    // Methods
    handleCreateSubmit,
    handleUpdateSubmit,
    handleDeleteSubmit,
    handleCloseForm,
    handleFormSubmitCreate,
    handleFormSubmitUpdate,
    handleReceiveData,
  }
}
