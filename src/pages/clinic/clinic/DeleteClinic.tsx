import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Toast } from "primereact/toast"
import React from "react"
import {
  modifyDeleteDialog,
  useAppDispatch,
  useAppSelector,
  useDeleteClinicMutation,
} from "../../../redux"

function DeleteClinic() {
  const dispatch = useAppDispatch()
  const { idSelected, showDeleteDialog } = useAppSelector(
    state => state.dataTable,
  )
  const [deleteClinic, { isLoading }] = useDeleteClinicMutation()
  const toastRef = React.useRef<Toast>(null)

  const handleClose = () => {
    if (!isLoading) {
      dispatch(modifyDeleteDialog(false))
    }
  }

  const handleDelete = () => {
    if (typeof idSelected === "number") {
      void deleteClinic(idSelected)
        .unwrap()
        .then(() => {
          toastRef.current?.show({
            severity: "success",
            summary: "Éxito",
            detail: "Clinica eliminado correctamente",
          })
          handleClose()
        })
        .catch((error: unknown) => {
          const errorMessage =
            error instanceof Error ? error.message : "Error desconocido"

          toastRef.current?.show({
            severity: "error",
            summary: "Error",
            detail: `No se pudo eliminar clinica: ${errorMessage}`,
          })
        })
    } else {
      toastRef.current?.show({
        severity: "error",
        summary: "Error",
        detail: "ID no válido: se requiere un number para eliminar clinica",
      })
    }
  }

  const renderFooter = () => (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={handleClose}
        disabled={isLoading}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={handleDelete}
        loading={isLoading}
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
        closable={!isLoading}
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
