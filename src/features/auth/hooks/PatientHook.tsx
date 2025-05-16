import { useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import { useAddPatientMutation } from "../../../redux"
import type { PatientRequest } from "../../patient/types/Patient"

export const usePatientHook = () => {
  const navigate = useNavigate()
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

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<PatientRequest>({ defaultValues })

  const [createPatient, { isLoading }] = useAddPatientMutation()

  const handleCreateSubmit = (data: PatientRequest) => {
    if (data.dateOfBirth instanceof Date) {
      data.dateOfBirth = data.dateOfBirth.toISOString()
    } else {
      throw new Error("La fecha de nacimiento debe ser válida")
    }
    data.gender = data.gender === "Hombre" ? "male" : "female"
    void createPatient(data)
      .unwrap()
      .then(() => {
        console.log("exito")
        void navigate("/")
      })
      .catch((error: unknown) => {
        console.log("error", error)
      })
  }

  const handleFormSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleCreateSubmit)(e as React.BaseSyntheticEvent)
  }

  return {
    control,
    errors,
    reset,
    handleSubmit,
    isLoading,

    handleCreateSubmit,
    handleFormSubmitCreate,
  }
}
