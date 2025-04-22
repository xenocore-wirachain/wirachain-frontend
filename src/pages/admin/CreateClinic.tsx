import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import React, { useState } from "react"
import { modifyCreateDialog, useAppDispatch, useAppSelector } from "../../redux"
import type { ClinicRequest } from "../../types/Clinic"

function CreateClinic() {
  const dispatch = useAppDispatch()
  const showCreateDialog = useAppSelector(
    state => state.dataTable.showCreateDialog,
  )

  const [clinic, setClinic] = useState<ClinicRequest>({
    ruc: "",
    address: "",
  })
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setClinic(prev => ({ ...prev, [name]: value }))
  }

  const productDialogFooter = (
    <React.Fragment>
      <Button label="Cancel" icon="pi pi-times" outlined />
      <Button label="Save" icon="pi pi-check" />
    </React.Fragment>
  )

  return (
    <Dialog
      header="Crear una clinica"
      footer={productDialogFooter}
      visible={showCreateDialog}
      onHide={() => {
        if (!showCreateDialog) return
        dispatch(modifyCreateDialog(false))
      }}
      className="w-xl"
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
    >
      <div className="p-4">
        <div className="mb-4">
          <label htmlFor="ruc" className="block text-sm font-medium mb-2">
            RUC
          </label>
          <InputText
            id="ruc"
            name="ruc"
            value={clinic.ruc}
            onChange={handleInputChange}
            className="w-full"
            placeholder="Enter RUC number"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium mb-2">
            Address
          </label>
          <InputText
            id="address"
            name="address"
            value={clinic.address}
            onChange={handleInputChange}
            className="w-full"
            placeholder="Enter clinic address"
          />
        </div>
      </div>
    </Dialog>
  )
}

export default CreateClinic
