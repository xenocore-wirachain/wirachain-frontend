import type { UUID } from "crypto"
import type { Toast } from "primereact/toast"
import { useRef } from "react"
import {
  modifyCreateDialog,
  modifyDeleteDialog,
  modifyIdSelected,
  modifyPage,
  modifySearch,
  modifyUpdateDialog,
  useAppDispatch,
  useAppSelector,
} from "../redux"

export const useDataTableHook = () => {
  const dispatch = useAppDispatch()
  const {
    page,
    pageSize,
    search,
    idSelected,
    showCreateDialog,
    showUpdateDialog,
    showDeleteDialog,
  } = useAppSelector(state => state.dataTable)
  const toastRef = useRef<Toast>(null)

  const openUpdateDialog = (id: UUID | number) => {
    dispatch(modifyIdSelected(id))
    dispatch(modifyUpdateDialog(true))
  }

  const openDeleteDialog = (id: UUID | number) => {
    dispatch(modifyIdSelected(id))
    dispatch(modifyDeleteDialog(true))
  }

  const openCreateDialog = () => {
    dispatch(modifyCreateDialog(true))
  }

  const closeAllDialogs = () => {
    dispatch(modifyCreateDialog(false))
    dispatch(modifyDeleteDialog(false))
    dispatch(modifyUpdateDialog(false))
  }

  const handlePageChange = (event: { first: number; rows: number }) => {
    const newPage = Math.floor(event.first / event.rows)
    dispatch(modifyPage(newPage + 1))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(modifySearch(e.target.value))
  }

  const handleApiError = (error: unknown) => {
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido"
    toastRef.current?.show({
      severity: "error",
      summary: "Error",
      detail: errorMessage,
      life: 5000,
    })
  }

  const handleError = (error: unknown) => {
    toastRef.current?.show({
      severity: "error",
      summary: "Error",
      detail: error instanceof Error ? error.message : "Error desconocido",
      life: 5000,
    })
  }

  const handleIdError = () => {
    toastRef.current?.show({
      severity: "error",
      summary: "Error",
      detail: "ID no válido",
      life: 5000,
    })
  }

  return {
    // Attributes
    page,
    pageSize,
    search,
    idSelected,
    showCreateDialog,
    showUpdateDialog,
    showDeleteDialog,

    // Toast Reference
    toastRef,

    //Methods
    openCreateDialog,
    openDeleteDialog,
    openUpdateDialog,
    closeAllDialogs,
    handlePageChange,
    handleSearch,
    handleApiError,
    handleError,
    handleIdError,
  }
}
