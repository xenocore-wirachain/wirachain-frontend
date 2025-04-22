import { Dialog } from "primereact/dialog"
import { modifyUpdateDialog, useAppDispatch, useAppSelector } from "../../redux"

function UpdateClinic() {
  const dispatch = useAppDispatch()
  const showUpdateDialog = useAppSelector(
    state => state.dataTable.showUpdateDialog,
  )

  return (
    <Dialog
      header="Actualizar una clinica"
      visible={showUpdateDialog}
      onHide={() => {
        if (!showUpdateDialog) return
        dispatch(modifyUpdateDialog(false))
      }}
      className="w-xl"
    >
      <p>Actualizar</p>
    </Dialog>
  )
}

export default UpdateClinic
