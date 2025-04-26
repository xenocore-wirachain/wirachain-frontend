import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Toast } from "primereact/toast"
import React, { useState } from "react"
import {
  modifyDeleteDialog,
  useAppDispatch,
  useAppSelector,
  useDeleteClinicMutation,
} from "../../../redux"

const DeleteClinic: React.FC = () => {
  const dispatch = useAppDispatch()
  const { idSelected, showDeleteDialog } = useAppSelector(
    state => state.dataTable,
  )
  const [deleteClinic] = useDeleteClinicMutation()
  const [isDeleting, setIsDeleting] = useState(false)
  const toastRef = React.useRef<Toast>(null)

  const handleClose = () => {
    if (!isDeleting) {
      dispatch(modifyDeleteDialog(false))
    }
  }

  const handleDelete = () => {
    if (idSelected) {
      try {
        setIsDeleting(true)
        void deleteClinic(idSelected)
          .unwrap()
          .then(() => {
            toastRef.current?.show({
              severity: "success",
              summary: "Éxito",
              detail: "Registro eliminado correctamente",
            })
            dispatch(modifyDeleteDialog(false))
          })
          .catch((error: unknown) => {
            const errorMessage =
              error instanceof Error ? error.message : "Error desconocido"

            toastRef.current?.show({
              severity: "error",
              summary: "Error",
              detail: `No se pudo eliminar el registro: ${errorMessage}`,
            })
          })
          .finally(() => {
            setIsDeleting(false)
          })
      } catch (error: unknown) {
        setIsDeleting(false)
        console.error("Error initiating delete:", error)
      }
    }
  }

  const renderFooter = () => (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={handleClose}
        disabled={isDeleting}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={handleDelete}
        loading={isDeleting}
      />
    </>
  )

  return (
    <>
      <Toast ref={toastRef} />
      <Dialog
        visible={showDeleteDialog}
        onHide={handleClose}
        header="Confirmar"
        footer={renderFooter()}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        className="delete-clinic-dialog"
        closable={!isDeleting}
      >
        <div className="confirmation-content flex align-items-center">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          <span>¿Estás seguro de eliminar este registro?</span>
        </div>
      </Dialog>
    </>
  )
}

export default DeleteClinic
