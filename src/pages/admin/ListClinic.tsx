import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog"
import { DataTable } from "primereact/datatable"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import React from "react"
import {
  modifyCreateDialog,
  modifyUpdateDialog,
  useAppDispatch,
  useAppSelector,
  useGetAllClinicsQuery,
} from "../../redux"
import CreateClinic from "./CreateClinic"
import UpdateClinic from "./UpdateClinic"

function ListClinic() {
  const dispatch = useAppDispatch()
  const { showCreateDialog, showUpdateDialog } = useAppSelector(
    state => state.dataTable,
  )
  const { data, error, isLoading } = useGetAllClinicsQuery(undefined)

  console.log("endpoint", import.meta.env.VITE_API_URL)
  console.log(data, error, isLoading)

  const renderHeader = () => {
    return (
      <div className="flex flex-wrap justify-between items-center">
        <p className="text-2xl">Lista de clinicas</p>
        <div className="flex flex-wrap justify-left gap-3">
          <IconField iconPosition="left">
            <InputIcon className="pi pi-search" />
            <InputText
              className="w-48"
              type="search"
              placeholder="Buscar por RUC"
            />
          </IconField>
          <Button
            onClick={() => {
              if (showCreateDialog) return
              dispatch(modifyCreateDialog(true))
            }}
            icon="pi pi-plus"
            label="Nuevo"
            severity="success"
            raised
          />
        </div>
      </div>
    )
  }

  const renderDeleteDialog = () => {
    confirmDialog({
      message: "¿Deseas eliminar este registro?",
      header: "Confirmar eliminación",
      icon: "pi pi-exclamation-triangle",
      defaultFocus: "accept",
    })
  }

  const actionBodyTemplate = () => {
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            if (showUpdateDialog) return
            dispatch(modifyUpdateDialog(true))
          }}
          icon="pi pi-pencil"
          className="mr-2"
        />
        <Button
          onClick={renderDeleteDialog}
          icon="pi pi-trash"
          severity="danger"
        />
      </React.Fragment>
    )
  }

  const header = renderHeader()

  return (
    <>
      <ConfirmDialog />
      <CreateClinic />
      <UpdateClinic />
      <DataTable value={data?.results} header={header} paginator rows={10}>
        <Column field="id" header="ID"></Column>
        <Column field="name" header="Name"></Column>
        <Column field="ruc" header="RUC"></Column>
        <Column
          body={actionBodyTemplate}
          exportable={false}
          style={{ minWidth: "4rem" }}
        ></Column>
      </DataTable>
    </>
  )
}

export default ListClinic
