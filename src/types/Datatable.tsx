import type { UUID } from "crypto"
import type { Toast } from "primereact/toast"
import type { PaginationParams } from "./Pagination"

export type DataTable = PaginationParams & {
  idSelected: UUID | number
  showCreateDialog: boolean
  showUpdateDialog: boolean
  showDeleteDialog: boolean
  toast?: React.RefObject<Toast>
}
