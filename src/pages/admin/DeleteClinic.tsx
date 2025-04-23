import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import React from "react"
import {
  modifyDeleteDialog,
  useAppDispatch,
  useAppSelector,
  useDeleteClinicMutation,
} from "../../redux"

function DeleteClinic() {
  const dispatch = useAppDispatch()
  const { idSelected, showDeleteDialog } = useAppSelector(
    state => state.dataTable,
  )
  const [deleteClinic] = useDeleteClinicMutation()

  const closeDialog = () => {
    dispatch(modifyDeleteDialog(false))
  }

  const onClickDelete = () => {
    void deleteClinic(idSelected)
    dispatch(modifyDeleteDialog(false))
  }

  const deleteProductDialogFooter = (
    <React.Fragment>
      <Button label="No" icon="pi pi-times" outlined onClick={closeDialog} />
      <Button
        label="Si"
        icon="pi pi-check"
        severity="danger"
        onClick={onClickDelete}
      />
    </React.Fragment>
  )

  return (
    <Dialog
      visible={showDeleteDialog}
      onHide={closeDialog}
      style={{ width: "32rem" }}
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
      header="Confirmar"
      footer={deleteProductDialogFooter}
    >
      <div className="confirmation-content">
        <i
          className="pi pi-exclamation-triangle mr-3"
          style={{ fontSize: "2rem" }}
        />
        <span>¿Estas seguro de eliminar este registro?</span>
      </div>
    </Dialog>
  )
}

export default DeleteClinic
