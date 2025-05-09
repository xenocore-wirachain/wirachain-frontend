import type { UUID } from "crypto"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import {
  useAddClinicAdminMutation,
  useDeleteClinicAdminMutation,
  useGetAllClinicAdminsQuery,
  useGetClinicAdminQuery,
  useUpdateClinicAdminMutation,
} from "../../../redux"
import { GenderDictionary } from "../../../utils/StaticVariables"
import type { ClinicAdminRequest } from "../types/ClinicAdmin"

export const useClinicAdminHook = () => {
  const baseHook = useDataTableHook()

  const defaultValues: ClinicAdminRequest = {
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    user: {
      phone: "",
      email: "",
      password: "",
    },
  }

  const { data, isLoading, isFetching } = useGetAllClinicAdminsQuery({
    page: baseHook.page,
    pageSize: baseHook.pageSize,
    search: baseHook.search,
  })

  const { data: clinicAdminData, isLoading: isLoadingAdminCLinic } =
    useGetClinicAdminQuery(baseHook.idSelected as UUID, {
      skip:
        !baseHook.showUpdateDialog || typeof baseHook.idSelected != "string",
    })

  const [createClinicAdmin, { isLoading: isCreating }] =
    useAddClinicAdminMutation()
  const [deleteClinicAdmin, { isLoading: isDeleting }] =
    useDeleteClinicAdminMutation()
  const [updateClinicAdmin, { isLoading: isUpdating }] =
    useUpdateClinicAdminMutation()

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ClinicAdminRequest>({ defaultValues })

  const handleCreateSubmit = (data: ClinicAdminRequest) => {
    if (data.dateOfBirth instanceof Date) {
      data.dateOfBirth = data.dateOfBirth.toISOString()
    } else {
      throw new Error("La fecha de nacimiento debe ser válida")
    }
    data.gender = data.gender === "Hombre" ? "male" : "female"
    void createClinicAdmin(data)
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess(
          "Éxito",
          "Administrador de clínica creado correctamente",
        )
        handleCloseForm()
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  const handleUpdateSubmit = (data: ClinicAdminRequest) => {
    if (data.dateOfBirth instanceof Date) {
      data.dateOfBirth = data.dateOfBirth.toISOString()
    } else {
      throw new Error("La fecha de nacimiento debe ser válida")
    }
    data.gender = data.gender === "Hombre" ? "male" : "female"
    if (typeof baseHook.idSelected === "string") {
      void updateClinicAdmin({ id: baseHook.idSelected, clinicAdmin: data })
        .unwrap()
        .then(() => {
          baseHook.toast.showSuccess(
            "Éxito",
            "Administrador de clínica actualizado correctamente",
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
    if (typeof baseHook.idSelected === "string") {
      void deleteClinicAdmin(baseHook.idSelected)
        .unwrap()
        .then(() => {
          baseHook.toast.showSuccess(
            "Éxito",
            "Administrador de clinica eliminado correctamente",
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
    if (baseHook.showUpdateDialog && clinicAdminData) {
      const updatedClinicAdminData = {
        ...clinicAdminData,
        gender:
          clinicAdminData.gender === "Male"
            ? GenderDictionary[0].value
            : GenderDictionary[1].value,
        dateOfBirth: clinicAdminData.dateOfBirth
          ? new Date(clinicAdminData.dateOfBirth)
          : null,
      }
      reset(updatedClinicAdminData)
    }
  }, [baseHook.showUpdateDialog, clinicAdminData, reset])

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
    isLoadingAdminCLinic,
    clinicAdminData,

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
