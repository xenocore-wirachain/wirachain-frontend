import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import {
  useGetClinicAdminQuery,
  useUpdateClinicAdminMutation,
} from "../../../redux"
import { GenderDictionary } from "../../../utils/StaticVariables"
import type { ClinicAdminRequest } from "../../admin/types/ClinicAdmin"
import { useAuth } from "../../auth/hooks/UseAuth"

export const useClinicAdminHook = () => {
  const baseHook = useDataTableHook()
  const { userId } = useAuth()

  if (!userId) {
    throw new Error("User ID is required for clinic admin operations")
  }
  const idAdminClinic = userId

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

  const { data: clinicAdminData, isLoading: isLoadingAdminCLinic } =
    useGetClinicAdminQuery(idAdminClinic)

  const [updateClinicAdmin, { isLoading: isUpdating }] =
    useUpdateClinicAdminMutation()

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ClinicAdminRequest>({ defaultValues })

  const handleUpdateSubmit = (data: ClinicAdminRequest) => {
    if (data.dateOfBirth instanceof Date) {
      data.dateOfBirth = data.dateOfBirth.toISOString()
    } else {
      throw new Error("La fecha de nacimiento debe ser válida")
    }
    data.gender = data.gender === "Hombre" ? "male" : "female"
    void updateClinicAdmin({ id: idAdminClinic, clinicAdmin: data })
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess(
          "Éxito",
          "Administrador de clínica actualizado correctamente",
        )
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  const handleReceiveData = useCallback(() => {
    if (clinicAdminData) {
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
  }, [clinicAdminData, reset])

  const handleFormSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleUpdateSubmit)(e as React.BaseSyntheticEvent)
  }

  return {
    ...baseHook,

    // Data fetching
    isLoadingAdminCLinic,
    clinicAdminData,

    // Form handling
    control,
    errors,
    isUpdating,
    defaultValues,

    // Methods
    handleUpdateSubmit,
    handleFormSubmitUpdate,
    handleReceiveData,
  }
}
