import type { UUID } from "crypto"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import { useGetPatientQuery, useUpdatePatientMutation } from "../../../redux"
import { GenderDictionary } from "../../../utils/StaticVariables"
import type { PatientRequest } from "../types/Patient"

export const usePatientHook = () => {
  const baseHook = useDataTableHook()
  const idPatient = "550e8400-e29b-41d4-a716-446655440000" as UUID

  const defaultValues: PatientRequest = {
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

  const { data: patientData, isLoading: isLoadingPatient } =
    useGetPatientQuery(idPatient)

  const [updatePatient, { isLoading: isUpdating }] = useUpdatePatientMutation()

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<PatientRequest>({ defaultValues })

  const handleUpdateSubmit = (data: PatientRequest) => {
    if (data.dateOfBirth instanceof Date) {
      data.dateOfBirth = data.dateOfBirth.toISOString()
    } else {
      throw new Error("La fecha de nacimiento debe ser válida")
    }
    data.gender = data.gender === "Hombre" ? "male" : "female"
    void updatePatient({ id: idPatient, patient: data })
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess(
          "Éxito",
          "Paciente actualizado correctamente",
        )
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  const handleReceiveData = useCallback(() => {
    if (patientData) {
      const updatedClinicAdminData = {
        ...patientData,
        gender:
          patientData.gender === "Male"
            ? GenderDictionary[0].value
            : GenderDictionary[1].value,
        dateOfBirth: patientData.dateOfBirth
          ? new Date(patientData.dateOfBirth)
          : null,
      }
      reset(updatedClinicAdminData)
    }
  }, [patientData, reset])

  const handleFormSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleUpdateSubmit)(e as React.BaseSyntheticEvent)
  }

  return {
    ...baseHook,

    // Data fetching
    isLoadingPatient,
    patientData,

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
