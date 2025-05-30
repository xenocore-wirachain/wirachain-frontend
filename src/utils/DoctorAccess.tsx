import type { DoctorDetailedResponse } from "../features/clinic/types/Doctor"

export const getDoctorDataFromStorage = (): DoctorDetailedResponse | null => {
  try {
    const doctorDataStr = localStorage.getItem("wirachain_doctor_data")
    if (!doctorDataStr) return null

    return JSON.parse(doctorDataStr) as DoctorDetailedResponse
  } catch (error) {
    console.error("Error retrieving doctor data from localStorage:", error)
    return null
  }
}
