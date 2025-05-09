import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import {
  useAddSpecialityMutation,
  useDeleteSpecialityMutation,
  useGetAllSpecialitiesQuery,
  useGetSpecialityQuery,
  useUpdateSpecialityMutation,
} from "../../../redux"
import type { SpecialityRequest } from "../types/Speciality"
import ConvertSpecialityResponseToSpecialityRequest from "../utils/SpecialityDTO"

export const useSpecialityHook = () => {
  const baseHook = useDataTableHook()

  const defaultValues: SpecialityRequest = {
    name: "",
  }

  const { data, isLoading, isFetching } = useGetAllSpecialitiesQuery({
    page: baseHook.page,
    pageSize: baseHook.pageSize,
    search: baseHook.search,
  })

  const { data: specialityData, isLoading: isLoadingSpeciality } =
    useGetSpecialityQuery(baseHook.idSelected as number, {
      skip:
        !baseHook.showUpdateDialog || typeof baseHook.idSelected != "number",
    })

  const [createSpeciality, { isLoading: isCreating }] =
    useAddSpecialityMutation()
  const [deleteSpeciality, { isLoading: isDeleting }] =
    useDeleteSpecialityMutation()
  const [updateSpeciality, { isLoading: isUpdating }] =
    useUpdateSpecialityMutation()

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<SpecialityRequest>({ defaultValues })

  const handleCreateSubmit = (data: SpecialityRequest) => {
    void createSpeciality(data)
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess("Éxito", "Especialidad creada correctamente")
        handleCloseForm()
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  const handleUpdateSubmit = (data: SpecialityRequest) => {
    if (typeof baseHook.idSelected === "number") {
      void updateSpeciality({ id: baseHook.idSelected, speciality: data })
        .unwrap()
        .then(() => {
          baseHook.toast.showSuccess(
            "Éxito",
            "Especialidad actualizada correctamente",
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
      void deleteSpeciality(baseHook.idSelected)
        .unwrap()
        .then(() => {
          baseHook.toast.showSuccess(
            "Éxito",
            "Especialidad eliminada correctamente",
          )
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
    if (baseHook.showUpdateDialog && specialityData) {
      const transformetData =
        ConvertSpecialityResponseToSpecialityRequest(specialityData)
      reset(transformetData)
    }
  }, [baseHook.showUpdateDialog, specialityData, reset])

  const handleCloseForm = () => {
    reset(defaultValues)
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

  return {
    ...baseHook,

    // Data fetching
    data,
    isLoading,
    isFetching,
    isLoadingSpeciality,
    specialityData,

    // Form handling
    control,
    errors,
    isCreating,
    isDeleting,
    isUpdating,
    defaultValues,

    // Methods
    handleCreateSubmit,
    handleDeleteSubmit,
    handleUpdateSubmit,
    handleCloseForm,
    handleFormSubmitCreate,
    handleFormSubmitUpdate,
    handleReceiveData,
  }
}
