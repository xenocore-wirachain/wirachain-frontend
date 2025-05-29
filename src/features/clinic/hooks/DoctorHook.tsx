import type { UUID } from "crypto"
import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import {
  useAddDoctorMutation,
  useDeleteDoctorMutation,
  useGetAllDoctorsQuery,
  useGetDoctorQuery,
  useUpdateDoctorMutation,
} from "../../../redux"
import { useAuth } from "../../auth/hooks/UseAuth"
import type { DoctorRequest } from "../types/Doctor"
import ConvertDoctorResponseToDoctorRequest from "../utils/DoctorDTO"

export const useDoctorHook = () => {
  const baseHook = useDataTableHook()
  const { userId } = useAuth()

  if (!userId) {
    throw new Error("User ID is required for clinic admin operations")
  }
  const idAdminClinic = userId

  const defaultValues: DoctorRequest = {
    firstName: "",
    lastName: "",
    gender: "",
    dateOfBirth: null,
    clinicIds: [],
    medicalSpecialtyIds: [],
    user: {
      phone: "",
      email: "",
      password: "",
    },
  }

  const { data, isLoading, isFetching } = useGetAllDoctorsQuery({
    id: idAdminClinic,
    pagination: {
      page: baseHook.page,
      pageSize: baseHook.pageSize,
      search: baseHook.search,
    },
  })

  const { data: doctorData, isLoading: isLoadingDoctor } = useGetDoctorQuery(
    baseHook.idSelected as UUID,
    {
      skip:
        !baseHook.showUpdateDialog || typeof baseHook.idSelected !== "string",
    },
  )

  const [createDoctor, { isLoading: isCreating }] = useAddDoctorMutation()
  const [deleteDoctor, { isLoading: isDeleting }] = useDeleteDoctorMutation()
  const [updateDoctor, { isLoading: isUpdating }] = useUpdateDoctorMutation()

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<DoctorRequest>({ defaultValues })

  const handleCreateSubmit = (data: DoctorRequest) => {
    if (data.dateOfBirth instanceof Date) {
      data.dateOfBirth = data.dateOfBirth.toISOString()
    } else {
      throw new Error("La fecha de nacimiento debe ser válida")
    }
    data.gender = data.gender === "Hombre" ? "male" : "female"
    void createDoctor(data)
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess("Éxito", "Doctor creado correctamente")
        handleCloseForm()
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  const handleUpdateSubmit = (data: DoctorRequest) => {
    if (data.dateOfBirth instanceof Date) {
      data.dateOfBirth = data.dateOfBirth.toISOString()
    } else {
      throw new Error("La fecha de nacimiento debe ser válida")
    }
    data.gender = data.gender === "Hombre" ? "male" : "female"
    if (typeof baseHook.idSelected === "string") {
      void updateDoctor({
        id: baseHook.idSelected,
        clinic: data,
      })
        .unwrap()
        .then(() => {
          baseHook.toast.showSuccess(
            "Éxito",
            "Doctor actualizado correctamente",
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
      void deleteDoctor(baseHook.idSelected)
        .unwrap()
        .then(() => {
          baseHook.toast.showSuccess("Éxito", "Doctro eliminado correctamente")
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
    if (baseHook.showUpdateDialog && doctorData) {
      const updateDoctorData = ConvertDoctorResponseToDoctorRequest(doctorData)
      reset(updateDoctorData)
    }
  }, [baseHook.showUpdateDialog, doctorData, reset])

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
    isLoadingDoctor,
    doctorData,

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
