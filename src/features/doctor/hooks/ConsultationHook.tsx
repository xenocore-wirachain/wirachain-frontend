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
    if (data.dateOfBirth instanceof Date) {
      data.dateOfBirth = data.dateOfBirth.toISOString()
    } else {
      throw new Error("La fecha de nacimiento debe ser válida")
    }
    if (data.consultationDate instanceof Date) {
      data.consultationDate = data.consultationDate.toISOString()
    } else {
      throw new Error("La fecha de consulta debe ser valida")
    }
    if (data.checkInTime instanceof Date) {
      // data.checkInTime = data.checkInTime.toISOString()
      data.checkInTime = "05:00"
    } else {
      throw new Error("La hora de llegada no es valida")
    }
    if (data.checkOutTime instanceof Date) {
      // data.checkOutTime = data.checkOutTime.toISOString()
      data.checkOutTime = "05:00"
    } else {
      throw new Error("La hora de salida no es valida")
    }
    console.log("CONSULTA MEDICA CREADAT", data)

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
        // void navigate("/register")
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
