import { UUID } from "crypto"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import {
  useAddClinicAdminMutation,
  useDeleteClinicAdminMutation,
  useGetAllClinicAdminsQuery,
  useGetClinicAdminQuery,
  useUpdateClinicAdminMutation,
} from "../../../redux"
import type { ClinicAdminRequest } from "../../../types/ClinicAdmin"

export const useClinicAdminHook = () => {
  const baseHook = useDataTableHook()

  const [defaultValues, setDefaulValues] = useState<ClinicAdminRequest>({
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    user: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
  })

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
        baseHook.toastRef.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Administrador de clínica creado correctamente",
          life: 3000,
        })
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
          baseHook.toastRef.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Administrador de clínica actualizado correctamente",
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
    if (typeof baseHook.idSelected === "string") {
      void deleteClinicAdmin(baseHook.idSelected)
        .unwrap()
        .then(() => {
          baseHook.toastRef.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Administrador de clinica eliminado correctamente",
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
      firstName: "",
      lastName: "",
      gender: "",
      dateOfBirth: null,
      user: {
        name: "",
        phone: "",
        email: "",
        password: "",
      },
    }
    setDefaulValues(emptyValues)
    reset(emptyValues)
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
    if (clinicAdminData && baseHook.showUpdateDialog) {
      console.log("LOG")
    }
  }, [clinicAdminData, baseHook.showUpdateDialog, reset])

  return {
    ...baseHook,

    // Data fetching
    data,
    isLoading,
    isFetching,

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
  }
}
