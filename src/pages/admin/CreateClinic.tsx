import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import {
  modifyCreateDialog,
  useAddClinicMutation,
  useAppDispatch,
  useAppSelector,
} from "../../redux"
import type { ClinicRequest } from "../../types/Clinic"

function CreateClinic() {
  const dispatch = useAppDispatch()
  const showCreateDialog = useAppSelector(
    state => state.dataTable.showCreateDialog,
  )
  const [addClinic] = useAddClinicMutation()
  const defaultValues: ClinicRequest = {
    ruc: "",
    name: "",
    address: "",
  }
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm({ defaultValues })

  const onSubmit = (data: ClinicRequest) => {
    void addClinic(data)
    dispatch(modifyCreateDialog(false))
    reset()
  }

  const getFormErrorMessage = (name: keyof ClinicRequest) => {
    return errors[name] ? (
      <small className="p-error">{errors[name].message}</small>
    ) : null
  }

  const closeDialog = () => {
    dispatch(modifyCreateDialog(false))
    reset()
  }

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={closeDialog}
      />
      <Button
        type="submit"
        form="createClinicForm"
        label="Guardar"
        icon="pi pi-check"
      />
    </React.Fragment>
  )

  return (
    <Dialog
      header="Crear una clinica"
      footer={productDialogFooter}
      visible={showCreateDialog}
      onHide={closeDialog}
      className="w-xl"
      breakpoints={{ "960px": "75vw", "641px": "90vw" }}
    >
      <form
        id="createClinicForm"
        onSubmit={e => {
          void handleSubmit(onSubmit)(e)
        }}
        className="p-fluid"
      >
        <div className="field mt-4">
          <span className="p-float-label">
            <Controller
              name="ruc"
              control={control}
              rules={{
                required: "RUC es requerido.",
                maxLength: {
                  value: 11,
                  message: "RUC debe tener 11 caracteres",
                },
                minLength: {
                  value: 11,
                  message: "RUC debe tener 11 caracteres",
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: "Solo puede contener numeros",
                },
              }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames({ "p-invalid": fieldState.invalid })}
                />
              )}
            />
            <label
              htmlFor="ruc"
              className={classNames({ "p-error": errors.ruc })}
            >
              RUC*
            </label>
          </span>
          {getFormErrorMessage("ruc")}
        </div>

        {/* Add name field */}
        <div className="field mt-4">
          <span className="p-float-label">
            <Controller
              name="name"
              control={control}
              rules={{
                required: "Nombre es requerido.",
              }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames({ "p-invalid": fieldState.invalid })}
                />
              )}
            />
            <label
              htmlFor="name"
              className={classNames({ "p-error": errors.address })}
            >
              Nombre*
            </label>
          </span>
          {getFormErrorMessage("name")}
        </div>

        {/* Add address field */}
        <div className="field mt-4">
          <span className="p-float-label">
            <Controller
              name="address"
              control={control}
              rules={{
                required: "Dirección es requerida.",
              }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  {...field}
                  className={classNames({ "p-invalid": fieldState.invalid })}
                />
              )}
            />
            <label
              htmlFor="address"
              className={classNames({ "p-error": errors.address })}
            >
              Dirección*
            </label>
          </span>
          {getFormErrorMessage("address")}
        </div>
      </form>
    </Dialog>
  )
}

export default CreateClinic
