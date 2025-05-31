import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import {
  useAddMedicalConsultationMutation,
  useGetAllMedicalConsultationPerDoctorAndClinicQuery,
} from "../../../redux"
import type { MedicalConsultationRequest } from "../../../types/MedicalConsultation"
import { useAuth } from "../../auth/hooks/UseAuth"

export const useConsultationHook = () => {
  const baseHook = useDataTableHook()
  const { userId } = useAuth()

  if (!userId) {
    throw new Error("User ID is required for clinic admin operations")
  }
  const idDoctor = userId
  const storeOption = localStorage.getItem("choosen_clinic")
  const idClinic = storeOption ? (JSON.parse(storeOption) as number) : 0

  const defaultValues: MedicalConsultationRequest = {
    idPatient: null,
    visitReason: "",
    dateOfBirth: null,
    consultationDate: null,
    notes: "",
    checkInTime: "",
    checkOutTime: "",
  }

  const { data: consultationData, isLoading: isLoadingConsultation } =
    useGetAllMedicalConsultationPerDoctorAndClinicQuery({
      idDoctor: idDoctor,
      idClinic: idClinic,
      pagination: {
        page: baseHook.page,
        pageSize: baseHook.pageSize,
        search: baseHook.search,
      },
    })

  const [createConsultation, { isLoading: isCreating }] =
    useAddMedicalConsultationMutation()

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<MedicalConsultationRequest>({ defaultValues })

  const handleCreateSubmit = (data: MedicalConsultationRequest) => {
    if (!data.idPatient) {
      throw new Error("Patient ID not in form")
    }
    void createConsultation({
      consultation: data,
      idDoctor: idDoctor,
      idClinic: idClinic,
      idPatient: data.idPatient,
    })
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess("Éxito", "Consulta creado correctamente")
        reset(defaultValues)
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  return {
    ...baseHook,

    // Data fetching
    consultationData,
    isLoadingConsultation,
    isCreating,

    // Form data
    control,
    errors,
    handleSubmit,

    // Methods
    handleCreateSubmit,
  }
}
