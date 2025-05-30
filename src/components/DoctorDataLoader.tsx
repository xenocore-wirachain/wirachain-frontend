import { useEffect } from "react"
import { useAuth } from "../features/auth/hooks/UseAuth"
import { useGetDoctorQuery } from "../redux/api/DoctorAPI"
import { USER_TYPES } from "../utils/StaticVariables"

const DoctorDataLoader = () => {
  const { userId, userType } = useAuth()
  const isDoctor = userType === USER_TYPES.DOCTOR && !!userId

  if (!userId) {
    throw new Error("User ID is required for clinic admin operations")
  }

  const { data: doctorData, isSuccess } = useGetDoctorQuery(userId, {
    skip: !isDoctor,
  })

  useEffect(() => {
    if (isSuccess && isDoctor) {
      try {
        localStorage.setItem(
          "available_clinic",
          JSON.stringify(doctorData.clinics),
        )
        localStorage.setItem(
          "choosen_clinic",
          JSON.stringify(doctorData.clinics[0].id),
        )
      } catch (error) {
        console.error("Error storing doctor data in localStorage", error)
      }
    }
  }, [doctorData, isSuccess, isDoctor])

  return null
}

export default DoctorDataLoader
