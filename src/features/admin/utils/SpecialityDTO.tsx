import type { SpecialityRequest, SpecialityResponse } from "../types/Speciality"

function ConvertSpecialityResponseToSpecialityRequest(
  data: SpecialityResponse,
): SpecialityRequest {
  const { name } = data
  return {
    name,
  }
}

export default ConvertSpecialityResponseToSpecialityRequest
