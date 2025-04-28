import { createSlice } from "@reduxjs/toolkit"
import type { Tokens } from "../../types/Credentials"

const initialState: Tokens = {
  accessToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvYW8iLCJ1c2VyX3R5cGUiOjEsImV4cCI6MTc0NDY2NDk3NCwidHlwZSI6ImFjY2VzcyJ9.1C3P1p_SOLyPYPwaSAWdH2w-YTB7PimJsU9c-nfXbtU",
  refreshToken:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6IkpvYW8iLCJ1c2VyX3R5cGUiOjEsImV4cCI6MTc0NTI2ODg3NCwidHlwZSI6InJlZnJlc2gifQ.DT3wY5k40IaBZNaFAA7HqrF7hnnMOa-4mEjiY76gWWM",
}

export const AuthSlice = createSlice({
  name: "base",
  initialState,
  reducers: {},
})

export const AuthReducer = AuthSlice.reducer
