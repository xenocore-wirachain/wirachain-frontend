import { http, HttpResponse } from "msw"
import { API_URL } from "../../src/utils/ApiPath"

export const handlers = [
  // Add your default handlers here for development
  http.post(`${API_URL}auth/login`, () => {
    return HttpResponse.json({
      accessToken: "mock-access-token",
      refreshToken: "mock-refresh-token",
      user: {
        id: "user-id",
        name: "Test User",
        user_type: 1,
      },
    })
  }),
]
