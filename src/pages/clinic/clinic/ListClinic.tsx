import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import React from "react"
import {
  modifyCreateDialog,
  modifyDeleteDialog,
  modifyIdSelected,
  modifyUpdateDialog,
  useAppDispatch,
  useAppSelector,
  useGetAllClinicsQuery,
} from "../../../redux"
import type { ClinicResponse } from "../../../types/Clinic"
import CreateClinic from "./CreateClinic"
import DeleteClinic from "./DeleteClinic"
import UpdateClinic from "./UpdateClinic"

function ListClinic() {
  const dispatch = useAppDispatch()
  const { page, showCreateDialog, showUpdateDialog, showDeleteDialog } =
    useAppSelector(state => state.dataTable)
  const { data } = useGetAllClinicsQuery(null)

  const onClickUpdate = (id: number) => {
    if (showUpdateDialog) return
    dispatch(modifyUpdateDialog(true))
    dispatch(modifyIdSelected(id))
  }

  const onClickDelete = (id: number) => {
    if (showDeleteDialog) return
    dispatch(modifyDeleteDialog(true))
    dispatch(modifyIdSelected(id))
  }

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

  const actionBodyTemplate = (rowData: ClinicResponse) => {
    return (
      <React.Fragment>
        <Button
          onClick={() => {
            onClickUpdate(rowData.id)
          }}
          icon="pi pi-pencil"
          className="mr-2"
        />
        <Button
          onClick={() => {
            onClickDelete(rowData.id)
          }}
          icon="pi pi-trash"
          severity="danger"
        />
      </React.Fragment>
    )
  }

  const onPageChange = (event: { first: number; rows: number }) => {
    console.log("CHANGE PAGE", event.first, event.rows)
  }

  const header = renderHeader()

  return (
    <>
      <DeleteClinic />
      <CreateClinic />
      <UpdateClinic />
      <DataTable
        paginator
        lazy
        value={data?.results}
        header={header}
        first={page}
        rows={10}
        totalRecords={100}
        onPage={onPageChange}
      >
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
