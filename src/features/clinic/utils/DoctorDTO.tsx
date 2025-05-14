import { GenderDictionary } from "../../../utils/StaticVariables"
import type { DoctorDetailedResponse, DoctorRequest } from "../types/Doctor"

function ConvertDoctorResponseToDoctorRequest(
  data: DoctorDetailedResponse,
): DoctorRequest {
  const {
    firstName,
    lastName,
    gender,
    dateOfBirth,
    medicalSpecialties,
    clinics,
  } = data

  return {
    firstName,
    lastName,
    gender:
      gender === "Male" ? GenderDictionary[0].value : GenderDictionary[1].value,
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    user: {
      phone: "987-654-321",
      email: "example@gmail.com",
    },
    clinicIds: clinics.map(clinic => clinic.id),
    medicalSpecialtyIds: medicalSpecialties.map(specialty => specialty.id),
  }
}

export default ConvertDoctorResponseToDoctorRequest
