import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { classNames } from "primereact/utils"
import React from "react"
import type {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import {
  modifyCreateDialog,
  useAddClinicMutation,
  useAppDispatch,
  useAppSelector,
} from "../../../redux"
import type { ClinicRequest } from "../../../types/Clinic"
import type { ClinicForm } from "../../../types/Form"

const CreateClinicComponent: React.FC = () => {
  const dispatch = useAppDispatch()
  const showCreateDialog = useAppSelector(
    state => state.dataTable.showCreateDialog,
  )
  const [addClinic, { isLoading }] = useAddClinicMutation()
  const toastRef = React.useRef<Toast>(null)

  const defaultValues: ClinicRequest = {
    ruc: 0,
    name: "",
    address: "",
  }

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ClinicRequest>({ defaultValues })

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

  const formFields: ClinicForm<ClinicRequest>[] = [
    {
      name: "ruc",
      label: "RUC*",
      inputType: "number",
      rules: {
        required: "RUC es requerido.",
        validate: (value: number) => {
          const rucString = String(value)
          if (rucString.length !== 11) {
            return "RUC debe tener 11 caracteres"
          }
          return true
        },
      },
      min: 10000000000, // 11 digits minimum
      max: 99999999999, // 11 digits maximum
    },
    {
      name: "name",
      label: "Nombre*",
      inputType: "text-notallow-number",
      rules: {
        required: "Nombre es requerido.",
      },
    },
    {
      name: "address",
      label: "Dirección*",
      inputType: "text-allow-number",
      rules: {
        required: "Dirección es requerida.",
      },
    },
  ]

  const renderInput = (
    field: ClinicForm<ClinicRequest>,
    formField: ControllerRenderProps<ClinicRequest, keyof ClinicRequest>,
    fieldState: ControllerFieldState,
  ) => {
    const commonProps = {
      id: formField.name,
      className: classNames({ "p-invalid": fieldState.invalid }),
      disabled: isLoading,
      placeholder: field.placeholder,
    }

    switch (field.inputType) {
      case "text-allow-number":
      case "text-notallow-number":
        return (
          <InputText
            {...commonProps}
            value={String(formField.value)}
            keyfilter={
              field.inputType === "text-notallow-number" ? "alpha" : undefined
            }
            onChange={e => {
              formField.onChange(e.target.value)
            }}
            onBlur={formField.onBlur}
            name={formField.name}
            ref={formField.ref}
          />
        )

      case "number":
        return (
          <InputNumber
            {...commonProps}
            value={
              typeof formField.value === "number" ? formField.value : undefined
            }
            onValueChange={e => {
              formField.onChange(e.value)
            }}
            min={field.min}
            max={field.max}
            useGrouping={false}
          />
        )

      default:
        return (
          <InputText
            {...commonProps}
            value={String(formField.value)}
            onChange={e => {
              formField.onChange(e.target.value)
            }}
            onBlur={formField.onBlur}
            name={formField.name}
            ref={formField.ref}
          />
        )
    }
  }

  const renderFormField = (field: ClinicForm<ClinicRequest>) => (
    <div className="field mt-4" key={field.name}>
      <span className="p-float-label">
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: formField, fieldState }) =>
            renderInput(field, formField, fieldState)
          }
        />
        <label
          htmlFor={field.name}
          className={classNames({ "p-error": errors[field.name] })}
        >
          {field.label}
        </label>
      </span>
      {errors[field.name] && (
        <small className="p-error">
          {errors[field.name]?.message?.toString()}
        </small>
      )}
    </div>
  )

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
          {formFields.map(renderFormField)}
        </form>
      </Dialog>
    </>
  )
}

export default CreateClinicComponent
