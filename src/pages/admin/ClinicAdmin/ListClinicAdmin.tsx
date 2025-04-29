import type { UUID } from "crypto"
import { Button } from "primereact/button"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { InputText } from "primereact/inputtext"
import {
  modifyCreateDialog,
  modifyDeleteDialog,
  modifyIdSelected,
  modifyPage,
  modifySearch,
  modifyUpdateDialog,
  useAppDispatch,
  useAppSelector,
  useGetAllClinicAdminsQuery,
} from "../../../redux"
import type { ClinicAdminResponse } from "../../../types/ClinicAdmin"
import CreateClinicAdmin from "./CreateClnicAdmin"
import DeleteClinicAdmin from "./DeleteClinicAdmin"

function ListClinicAdmin() {
  const dispatch = useAppDispatch()
  const {
    page,
    pageSize,
    search,
    showCreateDialog,
    showUpdateDialog,
    showDeleteDialog,
  } = useAppSelector(state => state.dataTable)
  const { data, isLoading, isFetching } = useGetAllClinicAdminsQuery({
    page: page,
    pageSize: pageSize,
    search: search,
  })

  const handleUpdate = (id: UUID) => {
    if (showUpdateDialog) return
    dispatch(modifyIdSelected(id))
    dispatch(modifyUpdateDialog(true))
  }

  const handleDelete = (id: UUID) => {
    if (showDeleteDialog) return
    dispatch(modifyIdSelected(id))
    dispatch(modifyDeleteDialog(true))
  }

  const handleCreateNew = () => {
    if (showCreateDialog) return
    dispatch(modifyCreateDialog(true))
  }

  const handlePageChange = (event: { first: number; rows: number }) => {
    const newPage = Math.floor(event.first / event.rows)
    dispatch(modifyPage(newPage + 1))
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(modifySearch(e.target.value))
  }

  const renderHeader = () => (
    <div className="flex flex-wrap justify-between items-center">
      <h2 className="text-2xl font-semibold">Lista de Administradores</h2>
      <div className="flex flex-wrap items-center gap-3">
        <InputText placeholder="Buscar" onChange={handleSearch} />
        <Button
          onClick={handleCreateNew}
          icon="pi pi-plus"
          label="Nuevo"
          severity="success"
          raised
        />
      </div>
    </div>
  )

  const actionBodyTemplate = (rowData: ClinicAdminResponse) => (
    <>
      <Button
        onClick={() => {
          handleUpdate(rowData.id)
        }}
        icon="pi pi-pencil"
        className="mr-2"
        tooltip="Editar"
        tooltipOptions={{ position: "top" }}
      />
      <Button
        onClick={() => {
          handleDelete(rowData.id)
        }}
        icon="pi pi-trash"
        severity="danger"
        tooltip="Eliminar"
        tooltipOptions={{ position: "top" }}
      />
    </>
  )

  return (
    <div className="card">
      <CreateClinicAdmin />
      <DeleteClinicAdmin />
      <DataTable
        lazy
        paginator
        value={data?.results}
        first={page * pageSize - 1}
        rows={pageSize}
        totalRecords={data?.count}
        loading={isLoading || isFetching}
        header={renderHeader()}
        onPage={handlePageChange}
        emptyMessage="No se encontraron administradores"
        className="p-datatable-gridlines"
      >
        <Column field="id" header="ID" style={{ width: "30%" }} />
        <Column field="firstName" header="Nombre" style={{ width: "30%" }} />
        <Column field="lastName" header="Apellido" style={{ width: "30%" }} />
        <Column
          body={actionBodyTemplate}
          header="Acciones"
          style={{ width: "10%", textAlign: "center" }}
          exportable={false}
        />
      </DataTable>
    </div>
  )
}

export default ListClinicAdmin
