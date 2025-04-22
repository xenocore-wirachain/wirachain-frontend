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
    addClinic: build.mutation<ClinicResponse, ClinicRequest>({
      query: clinic => ({
        url: "/clinic/",
        method: "POST",
        body: clinic,
      }),
    }),
  }),
})

export const { useGetAllClinicsQuery, useAddClinicMutation } = ClinicAPI
