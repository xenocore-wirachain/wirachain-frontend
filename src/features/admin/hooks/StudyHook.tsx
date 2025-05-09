import { useCallback } from "react"
import { useForm } from "react-hook-form"
import { useDataTableHook } from "../../../hooks/DataTableHook"
import {
  useAddStudyMutation,
  useDeleteStudyMutation,
  useGetAllStudiesQuery,
  useGetStudyQuery,
  useUpdateStudyMutation,
} from "../../../redux"
import type { StudyRequest } from "../types/Study"
import ConvertStudyResponseToStudyRequest from "../utils/StudyDTO"

export const useStudyHook = () => {
  const baseHook = useDataTableHook()

  const defaultValues: StudyRequest = {
    name: "",
  }

  const { data, isLoading, isFetching } = useGetAllStudiesQuery({
    page: baseHook.page,
    pageSize: baseHook.pageSize,
    search: baseHook.search,
  })

  const { data: studyData, isLoading: isLoadingStudy } = useGetStudyQuery(
    baseHook.idSelected as number,
    {
      skip:
        !baseHook.showUpdateDialog || typeof baseHook.idSelected != "number",
    },
  )

  const [createStudy, { isLoading: isCreating }] = useAddStudyMutation()
  const [deleteStudy, { isLoading: isDeleting }] = useDeleteStudyMutation()
  const [updateStudy, { isLoading: isUpdating }] = useUpdateStudyMutation()

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<StudyRequest>({ defaultValues })

  const handleCreateSubmit = (data: StudyRequest) => {
    void createStudy(data)
      .unwrap()
      .then(() => {
        baseHook.toast.showSuccess("Éxito", "Estudio creado correctamente")
        handleCloseForm()
      })
      .catch((error: unknown) => {
        baseHook.handleApiError(error)
      })
  }

  const handleUpdateSubmit = (data: StudyRequest) => {
    if (typeof baseHook.idSelected === "number") {
      void updateStudy({ id: baseHook.idSelected, study: data })
        .unwrap()
        .then(() => {
          baseHook.toast.showSuccess(
            "Éxito",
            "Estudio actualizado correctamente",
          )
          handleCloseForm()
        })
        .catch((error: unknown) => {
          baseHook.handleApiError(error)
        })
    } else {
      baseHook.handleIdError()
    }
  }

  const handleDeleteSubmit = () => {
    if (typeof baseHook.idSelected === "number") {
      void deleteStudy(baseHook.idSelected)
        .unwrap()
        .then(() => {
          baseHook.toast.showSuccess("Éxito", "Estudio eliminado correctamente")
          baseHook.closeAllDialogs()
        })
        .catch((error: unknown) => {
          baseHook.handleApiError(error)
        })
    } else {
      baseHook.handleIdError()
    }
  }

  const handleReceiveData = useCallback(() => {
    if (baseHook.showUpdateDialog && studyData) {
      const transformedData = ConvertStudyResponseToStudyRequest(studyData)
      reset(transformedData)
    }
  }, [baseHook.showUpdateDialog, studyData, reset])

  const handleCloseForm = () => {
    reset(defaultValues)
    baseHook.closeAllDialogs()
  }

  const handleFormSubmitCreate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleCreateSubmit)(e as React.BaseSyntheticEvent)
  }

  const handleFormSubmitUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(handleUpdateSubmit)(e as React.BaseSyntheticEvent)
  }

  return {
    ...baseHook,

    // Data fetching
    data,
    isLoading,
    isFetching,
    isLoadingStudy,
    studyData,

    // Form handling
    control,
    errors,
    isCreating,
    isDeleting,
    isUpdating,
    defaultValues,

    // Methods
    handleCreateSubmit,
    handleDeleteSubmit,
    handleUpdateSubmit,
    handleCloseForm,
    handleFormSubmitCreate,
    handleFormSubmitUpdate,
    handleReceiveData,
  }
}
