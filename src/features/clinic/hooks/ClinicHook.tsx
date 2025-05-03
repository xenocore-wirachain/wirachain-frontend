import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import {
  useAddClinicMutation,
  useDeleteClinicMutation,
  useGetAllClinicsQuery,
  useGetClinicQuery,
  useUpdateClinicMutation,
} from "../../../redux"
import type { ClinicRequest } from "../types/Clinic"
import ConverClinicResponseToClinicRequest from "../utils/ClinicDTO"

export const useClinicHook = () => {
  const baseHook = useDataTableHook()

  const [defaultValues, setDefaultValues] = useState<ClinicRequest>({
    administratorId: "550e8400-e29b-41d4-a716-446655440000",
    ruc: "",
    name: "",
    address: "",
  })

  const { data, isLoading, isFetching } = useGetAllClinicsQuery({
    page: baseHook.page,
    pageSize: baseHook.pageSize,
    search: baseHook.search,
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
        baseHook.toastRef.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Clinica creado correctamente",
          life: 3000,
        })
        handleCloseForm()
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  const handleUpdateSubmit = (data: ClinicRequest) => {
    console.log("UPDATE")
    if (typeof baseHook.idSelected === "number") {
      void updateClinic({
        id: baseHook.idSelected,
        clinic: data,
      })
        .unwrap()
        .then(() => {
          baseHook.toastRef.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Clinica actualizada correctamente",
            life: 3000,
          })
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
          baseHook.toastRef.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Clinica eliminada correctamente",
          })
          baseHook.closeAllDialogs()
        })
        .catch((error: unknown) => {
          baseHook.handleApiError(error)
        })
    } else {
      baseHook.handleIdError()
    }
  }

  const handleCloseForm = () => {
    const emptyValues = {
      administratorId: "550e8400-e29b-41d4-a716-446655440000",
      ruc: "",
      name: "",
      address: "",
    }
    setDefaultValues(emptyValues as ClinicRequest)
    reset(emptyValues as ClinicRequest)
    baseHook.closeAllDialogs()
  }

  const handleFormSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleCreateSubmit)(e as React.BaseSyntheticEvent)
  }

  const handleFormSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleUpdateSubmit)(e as React.BaseSyntheticEvent)
  }

  useEffect(() => {
    if (clinicData && baseHook.showUpdateDialog) {
      const transformedData = ConverClinicResponseToClinicRequest(
        clinicData,
        defaultValues.administratorId,
      )
      setDefaultValues(transformedData)
      reset(transformedData)
    }
  }, [
    clinicData,
    baseHook.showUpdateDialog,
    reset,
    defaultValues.administratorId,
  ])

  return {
    ...baseHook,

    // Data fetching
    data,
    isLoading,
    isFetching,
    isLoadingClinic,

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
  }
}
