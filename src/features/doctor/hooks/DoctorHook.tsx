import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import { useGetDoctorQuery, useUpdateDoctorMutation } from "../../../redux"
import { GenderDictionary } from "../../../utils/StaticVariables"
import { useAuth } from "../../auth/hooks/UseAuth"
import type { DoctorDetailedResponse } from "../../clinic/types/Doctor"
import ConvertDoctorResponseToDoctorRequest from "../../clinic/utils/DoctorDTO"

export const useDoctorHook = () => {
  const baseHook = useDataTableHook()
  const { userId } = useAuth()

  if (!userId) {
    throw new Error("User ID is required for clinic admin operations")
  }
  const idDoctor = userId

  const { data: doctorData, isLoading: isLoadingDoctor } =
    useGetDoctorQuery(idDoctor)
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation()

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<DoctorDetailedResponse>({
    defaultValues: {} as DoctorDetailedResponse,
  })

  const handleUpdateSubmit = (data: DoctorDetailedResponse) => {
    const newDoctorData = ConvertDoctorResponseToDoctorRequest(data)
    void updateDoctor({
      id: idDoctor,
      doctor: newDoctorData,
    })
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess("Éxito", "Doctor actualizado correctamente")
      })
      .catch((error: unknown) => {
        console.log("ERROR UPDATING", error)
        baseHook.handleApiError(error)
      })
  }

  const handleFormSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleUpdateSubmit)(e as React.BaseSyntheticEvent)
  }

  useEffect(() => {
    if (doctorData) {
      const updateDoctor = {
        ...doctorData,
        gender:
          doctorData.gender === "Male"
            ? GenderDictionary[0].value
            : GenderDictionary[1].value,
        dateOfBirth: doctorData.dateOfBirth
          ? new Date(doctorData.dateOfBirth)
          : null,
      }
      reset(updateDoctor)
    }
  }, [doctorData, reset])

  return {
    ...baseHook,

    // Data fetching
    doctorData,
    isLoadingDoctor,

    // Form handling
    control,
    errors,
    isUpdating,

    // Methods
    handleSubmit,
    handleFormSubmitUpdate,
  }
}
