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
import type { DoctorRequest } from "../../../types/Doctor"
import ConverClinicResponseToClinicRequest from "../utils/ClinicDTO"

export const useDoctorHook = () => {
  const baseHook = useDataTableHook()
  const idAdminClinic = "550e8400-e29b-41d4-a716-446655440000" as UUID

  const defaultValues: DoctorRequest = {
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
    void createDoctor(data)
      .unwrap()
      .then(() => {
        baseHook.toastRef.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Doctor creado correctamente",
          life: 3000,
        })
        handleCloseForm()
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  const handleUpdateSubmit = (data: DoctorRequest) => {
    if (typeof baseHook.idSelected === "string") {
      void updateDoctor({
        id: baseHook.idSelected,
        clinic: data,
      })
        .unwrap()
        .then(() => {
          baseHook.toastRef.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Doctor actualizado correctamente",
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
      void deleteDoctor(baseHook.idSelected)
        .unwrap()
        .then(() => {
          baseHook.toastRef.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Doctor eliminado correctamente",
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

  const handleReceiveData = useCallback(() => {
    if (baseHook.showUpdateDialog && doctorData) {
      const transformedData = ConverClinicResponseToClinicRequest(
        doctorData,
        idAdminClinic,
      )
      reset(transformedData)
    }
  }, [baseHook.showUpdateDialog, doctorData, reset])

  const handleCloseForm = () => {
    baseHook.closeAllDialogs()
    reset(defaultValues)
  }
}
