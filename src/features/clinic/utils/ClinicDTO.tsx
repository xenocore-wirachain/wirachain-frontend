import type { UUID } from "crypto"
import type { ClinicRequest, ClinicResponse } from "../types/Clinic"

function ConverClinicResponseToClinicRequest(
  data: ClinicResponse,
  id: UUID,
): ClinicRequest {
  const { ruc, name, address } = data
  const administratorId = id

  return {
    ruc,
    name,
    address,
    administratorId,
  }
}

export default ConverClinicResponseToClinicRequest
