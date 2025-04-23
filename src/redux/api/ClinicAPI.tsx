import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ClinicRequest, ClinicResponse } from "../../types/Clinic"
import type { Pagination } from "../../types/Pagination"

const API_URL = import.meta.env.VITE_API_URL as string

export const ClinicAPI = createApi({
  reducerPath: "ClinicAPI",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  endpoints: build => ({
    getAllClinics: build.query<Pagination<ClinicResponse>, undefined>({
      query: () => ({
        url: "/clinic/",
        method: "GET",
      }),
    }),
    getClinic: build.query<ClinicResponse, number>({
      query: clinic_id => ({
        url: `/clinic/${String(clinic_id)}/`,
        method: "GET",
      }),
    }),
    addClinic: build.mutation<ClinicResponse, ClinicRequest>({
      query: clinic => ({
        url: "/clinic/",
        method: "POST",
        body: clinic,
      }),
    }),
    updateClinic: build.mutation<ClinicResponse, ClinicResponse>({
      query: clinic => ({
        url: `/clinic/${String(clinic.id)}/`,
        method: "PUT",
        body: clinic,
      }),
    }),
    deleteClinic: build.mutation<undefined, number>({
      query: clinic_id => ({
        url: `/clinic/${String(clinic_id)}/`,
        method: "DELETE",
      }),
    }),
  }),
})

export const {
  useGetAllClinicsQuery,
  useAddClinicMutation,
  useGetClinicQuery,
  useUpdateClinicMutation,
  useDeleteClinicMutation,
} = ClinicAPI
