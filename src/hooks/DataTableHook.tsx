import type { UUID } from "crypto"
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
import { useToast } from "./ToastHook"

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
  const toast = useToast()

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
    toast.showError("Error", errorMessage)
  }

  const handleError = (error: unknown) => {
    toast.showError(
      "Error",
      error instanceof Error ? error.message : "Error desconocido",
    )
  }

  const handleIdError = () => {
    toast.showError("Error", "ID no válido")
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
    toast,

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
