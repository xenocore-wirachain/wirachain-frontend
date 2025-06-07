import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
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
  const navigate = useNavigate()

  if (!userId) {
    throw new Error("User ID is required for clinic admin operations")
  }
  const idDoctor = userId
  const storeOption = localStorage.getItem("choosen_clinic")
  const idClinic = storeOption ? (JSON.parse(storeOption) as number) : 0

  const defaultValues: MedicalConsultationRequest = {
    idPatient: null,
    visitReason: "",
    nextAppointmentDate: null,
    notes: "",
    checkInDateTime: Date(),
    checkOutDateTime: Date(),
    medicalTestIds: [],
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
    if (data.nextAppointmentDate instanceof Date) {
      data.nextAppointmentDate = data.nextAppointmentDate.toISOString()
    } else {
      throw new Error("La hora de la proxima fecha no es valida")
    }
    if (data.checkInDateTime instanceof Date) {
      data.checkInDateTime = data.checkInDateTime.toISOString()
    } else {
      throw new Error("La hora de llegada no es valida")
    }
    if (data.checkOutDateTime instanceof Date) {
      data.checkOutDateTime = data.checkOutDateTime.toISOString()
    } else {
      throw new Error("La hora de salida no es valida")
    }

    console.log("CREATION DATA", data)
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
        void navigate("/dashboard/doctor/appointment-list")
      })
      .catch((error: unknown) => {
        console.log("ERROR", error)
        baseHook.handleApiError(error)
      })
  }

  const handleFormSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleCreateSubmit)(e as React.BaseSyntheticEvent)
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
    handleFormSubmitCreate,
  }
}
