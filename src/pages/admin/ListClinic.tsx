import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { IconField } from "primereact/iconfield"
import { InputIcon } from "primereact/inputicon"
import { InputText } from "primereact/inputtext"
import React from "react"
import type { Clinic } from "../../types/Clinic"

const DATA_CLINICS: Clinic[] = [
  {
    id: 1,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 2,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 3,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 4,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 4,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 4,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 4,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 4,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 4,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 4,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 4,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 4,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
  {
    id: 4,
    name: "clinic1",
    phone: 999999999,
    mail: "clinic1@gmail.com",
    password: "pass",
    is_active: true,
    user_type_id: 1,
    ruc: 1234235,
    address: "aqui",
  },
]

function ListClinic() {
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
          <Button icon="pi pi-plus" label="Nuevo" severity="success" raised />
        </div>
      </div>
    )
  }

  const actionBodyTemplate = () => {
    return (
      <React.Fragment>
        <Button icon="pi pi-pencil" className="mr-2" />
        <Button icon="pi pi-trash" severity="danger" />
      </React.Fragment>
    )
  }

  const header = renderHeader()

  return (
    <>
      <DataTable value={DATA_CLINICS} header={header} paginator rows={10}>
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
