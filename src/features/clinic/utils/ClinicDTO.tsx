import type { UUID } from "crypto"
import type { ClinicRequest, ClinicResponse } from "../types/Clinic"

function ConverClinicResponseToClinicRequest(
  data: ClinicResponse,
  id: UUID,
): ClinicRequest {
  const { ruc, name, address, medicalTests } = data
  const administratorId = id

  return {
    ruc,
    name,
    address,
    administratorId,
    medicalTestIds: medicalTests.map(test => test.id),
  }
}

export default ConverClinicResponseToClinicRequest
