import { useState } from "react"
import { useForm } from "react-hook-form"
import {
  useAddClinicAdminMutation,
  useDeleteClinicAdminMutation,
  useGetAllClinicAdminsQuery,
} from "../redux"
import type { ClinicAdminRequest } from "../types/ClinicAdmin"
import { useDataTableHook } from "./DataTableHook"

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

  const [createClinicAdmin, { isLoading: isCreating }] =
    useAddClinicAdminMutation()
  const [deleteClinicAdmin, { isLoading: isDeleting }] =
    useDeleteClinicAdminMutation()

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
      baseHook.toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "ID no válido",
      })
    }
  }

  const handleCloseForm = () => {
    baseHook.closeAllDialogs()
    reset()
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleCreateSubmit)(e as React.BaseSyntheticEvent)
  }

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
    defaultValues,

    // Methods
    handleCreateSubmit,
    handleDeleteSubmit,
    handleCloseForm,
    handleFormSubmit,
  }
}
