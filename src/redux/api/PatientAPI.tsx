import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  PatientRequest,
  PatientResponse,
} from "../../features/patient/types/Patient"
import { API_URL, BASE_PATH } from "../../utils/ApiPath"

const PATIENT_PATH = BASE_PATH.patient

export const patientApi = createApi({
  reducerPath: "patientApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Patient"],
  endpoints: builder => ({
    addPatient: builder.mutation<PatientResponse, PatientRequest>({
      query: patient => ({
        url: PATIENT_PATH,
        method: "POST",
        body: patient,
      }),
    }),
  }),
})

export const { useAddPatientMutation } = patientApi
