import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type { ClinicResponse } from "../../types/Clinic"
import type { Pagination } from "../../types/Pagination"

export const ClinicAPI = createApi({
  reducerPath: "ClinicAPI",
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_API_URL }),
  endpoints: build => ({
    getAllClinics: build.query<Pagination<ClinicResponse>, undefined>({
      query: () => {
        return {
          url: "/clinic",
          method: "GET",
        }
      },
    }),
  }),
})

export const { useGetAllClinicsQuery } = ClinicAPI
