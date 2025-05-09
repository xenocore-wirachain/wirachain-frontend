import type { StudyRequest, StudyResponse } from "../types/Study"

function ConvertStudyResponseToStudyRequest(data: StudyResponse): StudyRequest {
  const { name } = data
  return {
    name,
  }
}

export default ConvertStudyResponseToStudyRequest
