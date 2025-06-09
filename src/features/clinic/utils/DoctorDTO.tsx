import type { DoctorDetailedResponse, DoctorRequest } from "../types/Doctor"

function ConvertDoctorResponseToDoctorRequest(
  data: DoctorDetailedResponse,
): DoctorRequest {
  const {
    firstName,
    lastName,
    gender,
    phone,
    email,
    dateOfBirth,
    medicalSpecialties,
    clinics,
  } = data

  return {
    firstName,
    lastName,
    gender: gender === "Hombre" ? "male" : "female",
    dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
    user: {
      phone: phone,
      email: email,
    },
    clinicIds: clinics.map(clinic => clinic.id),
    medicalSpecialtyIds: medicalSpecialties.map(specialty => specialty.id),
  }
}

export default ConvertDoctorResponseToDoctorRequest
