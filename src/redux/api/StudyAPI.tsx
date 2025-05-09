import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
  StudyRequest,
  StudyResponse,
} from "../../features/admin/types/Study"
import type { Pagination, PaginationParams } from "../../types/Pagination"
import { API_URL, BASE_PATH } from "../../utils/ApiPath"

const STUDY_PATH = BASE_PATH.study

export const studyApi = createApi({
  reducerPath: "studyApi",
  baseQuery: fetchBaseQuery({ baseUrl: API_URL }),
  tagTypes: ["Study"],
  endpoints: builder => ({
    getAllStudies: builder.query<Pagination<StudyResponse>, PaginationParams>({
      query: ({ page, pageSize, search }) => ({
        url: `${STUDY_PATH}/page`,
        method: "GET",
        params: {
          pageIndex: page,
          pageSize: pageSize,
          searchTerm: search,
        },
      }),
      providesTags: result =>
        result
          ? [
              ...result.results.map(({ id }) => ({
                type: "Study" as const,
                id,
              })),
              { type: "Study", id: "LIST" },
            ]
          : [{ type: "Study", id: "LIST" }],
    }),

    getStudy: builder.query<StudyResponse, number>({
      query: studyId => ({
        url: `${STUDY_PATH}/${studyId.toString()}`,
        method: "GET",
      }),
      providesTags: (_result, _error, id) => [{ type: "Study" as const, id }],
    }),

    addStudy: builder.mutation<StudyResponse, StudyRequest>({
      query: study => ({
        url: STUDY_PATH,
        method: "POST",
        body: study,
      }),
      invalidatesTags: [{ type: "Study" as const, id: "LIST" }],
    }),

    updateStudy: builder.mutation<
      StudyResponse,
      { id: number; study: StudyRequest }
    >({
      query: params => ({
        url: `${STUDY_PATH}/${params.id.toString()}`,
        method: "PUT",
        body: params.study,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Study" as const, id },
        { type: "Study" as const, id: "LIST" },
      ],
    }),

    deleteStudy: builder.mutation<null, number>({
      query: studyId => ({
        url: `${STUDY_PATH}/${studyId.toString()}`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "Study" as const, id },
        { type: "Study" as const, id: "LIST" },
      ],
    }),
  }),
})

export const {
  useGetAllStudiesQuery,
  useGetStudyQuery,
  useAddStudyMutation,
  useUpdateStudyMutation,
  useDeleteStudyMutation,
} = studyApi
