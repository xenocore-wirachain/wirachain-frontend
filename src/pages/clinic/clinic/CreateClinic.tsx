import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { classNames } from "primereact/utils"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import {
  modifyCreateDialog,
  useAddClinicMutation,
  useAppDispatch,
  useAppSelector,
} from "../../../redux"
import type { ClinicRequest } from "../../../types/Clinic"

function CreateClinic() {
  const dispatch = useAppDispatch()
  const showCreateDialog = useAppSelector(
    state => state.dataTable.showCreateDialog,
  )
  const defaultValues: ClinicRequest = {
    administratorId: "550e8400-e29b-41d4-a716-446655440000",
    name: "",
    address: "",
    ruc: "",
  }
  const [addClinic, { isLoading }] = useAddClinicMutation()
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ClinicRequest>({ defaultValues })
  const toastRef = React.useRef<Toast>(null)

  const handleClose = () => {
    dispatch(modifyCreateDialog(false))
    reset()
  }

  const onSubmit = (data: ClinicRequest) => {
    void addClinic(data)
      .unwrap()
      .then(() => {
        toastRef.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Clínica creada correctamente",
        })
        handleClose()
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido"

        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: `No se pudo crear la clínica: ${errorMessage}`,
        })
      })
  }

  const renderFooter = () => (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={handleClose}
        disabled={isLoading}
      />
      <Button
        type="submit"
        form="createClinicForm"
        label="Guardar"
        icon="pi pi-check"
        loading={isLoading}
      />
    </>
  )

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(onSubmit)(e as React.BaseSyntheticEvent)
  }

  return (
    <>
      <Toast ref={toastRef} />
      <Dialog
        header="Crear una clínica"
        footer={renderFooter()}
        visible={showCreateDialog}
        onHide={handleClose}
        className="w-xl"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        closable={!isLoading}
      >
        <form
          id="createClinicForm"
          onSubmit={handleFormSubmit}
          className="p-fluid"
        >
          {/* NOMBRE */}
          <div className="field mt-4" key="name">
            <span className="p-float-label">
              <Controller
                name="name"
                control={control}
                rules={{ required: "Se requiere nombre" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.name ? true : false}
                    disabled={isLoading}
                  />
                )}
              />
              <label
                htmlFor="name"
                className={classNames({ "p-error": errors.name })}
              >
                Nombre*
              </label>
            </span>
            {errors.name && (
              <small className="p-error">
                {errors.name.message?.toString()}
              </small>
            )}
          </div>

          {/* RUC */}
          <div className="field mt-4" key="ruc">
            <span className="p-float-label">
              <Controller
                name="ruc"
                control={control}
                rules={{
                  required: "Se requiere ruc",
                  validate: (value: string) => {
                    if (value.length !== 11) {
                      return "RUC debe tener 11 caracteres"
                    }
                    return true
                  },
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.ruc ? true : false}
                    disabled={isLoading}
                    keyfilter="int"
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
            {errors.ruc && (
              <small className="p-error">
                {errors.ruc.message?.toString()}
              </small>
            )}
          </div>

          {/* ADRRESS */}
          <div className="field mt-4" key="address">
            <span className="p-float-label">
              <Controller
                name="address"
                control={control}
                rules={{ required: "Se requiere direccion" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.address ? true : false}
                    disabled={isLoading}
                  />
                )}
              />
              <label
                htmlFor="address"
                className={classNames({ "p-error": errors.address })}
              >
                Direccion*
              </label>
            </span>
            {errors.address && (
              <small className="p-error">
                {errors.address.message?.toString()}
              </small>
            )}
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default CreateClinic
