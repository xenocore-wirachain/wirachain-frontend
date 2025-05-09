import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { useClinicAdminHook } from "../../hooks/ClinicAdminHook"

function DeleteClinicAdmin() {
  const { showDeleteDialog, isDeleting, closeAllDialogs, handleDeleteSubmit } =
    useClinicAdminHook()

  const renderFooter = () => (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        outlined
        onClick={closeAllDialogs}
        disabled={isDeleting}
      />
      <Button
        label="Sí"
        icon="pi pi-check"
        severity="danger"
        onClick={handleDeleteSubmit}
        loading={isDeleting}
      />
    </>
  )

  return (
    <>
      <Dialog
        visible={showDeleteDialog}
        onHide={closeAllDialogs}
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

export default DeleteClinicAdmin
