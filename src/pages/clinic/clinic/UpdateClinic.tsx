import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { InputNumber } from "primereact/inputnumber"
import { InputText } from "primereact/inputtext"
import { Toast } from "primereact/toast"
import { classNames } from "primereact/utils"
import React, { useEffect, useState } from "react"
import type {
  ControllerFieldState,
  ControllerRenderProps,
} from "react-hook-form"
import { Controller, useForm } from "react-hook-form"
import {
  modifyUpdateDialog,
  useAppDispatch,
  useAppSelector,
  useGetClinicQuery,
  useUpdateClinicMutation,
} from "../../../redux"
import type { ClinicResponse } from "../../../types/Clinic"
import type { ClinicForm } from "../../../types/Form"

const UpdateClinicComponent: React.FC = () => {
  const dispatch = useAppDispatch()
  const { idSelected, showUpdateDialog } = useAppSelector(
    state => state.dataTable,
  )
  const [updateClinic] = useUpdateClinicMutation()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toastRef = React.useRef<Toast>(null)

  const shouldFetch = showUpdateDialog && idSelected > 0
  const { data, isLoading } = useGetClinicQuery(idSelected, {
    skip: !shouldFetch,
  })

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ClinicResponse>()

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data, reset])

  const handleClose = () => {
    dispatch(modifyUpdateDialog(false))
    reset()
  }

  const onSubmit = (formData: ClinicResponse) => {
    setIsSubmitting(true)

    void updateClinic(formData)
      .unwrap()
      .then(() => {
        toastRef.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Clínica actualizada correctamente",
        })
        handleClose()
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido"

        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: `No se pudo actualizar la clínica: ${errorMessage}`,
        })
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }

  const formFields: ClinicForm<ClinicResponse>[] = [
    {
      name: "ruc",
      label: "RUC*",
      inputType: "number",
      rules: {
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
          message: "Solo puede contener números",
        },
      },
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
    field: ClinicForm<ClinicResponse>,
    formField: ControllerRenderProps<ClinicResponse, keyof ClinicResponse>,
    fieldState: ControllerFieldState,
  ) => {
    const commonProps = {
      id: formField.name,
      className: classNames({ "p-invalid": fieldState.invalid }),
      disabled: isSubmitting,
      placeholder: field.placeholder,
    }

    switch (field.inputType) {
      case "text-allow-number":
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

      case "text-notallow-number":
        return (
          <InputText
            {...commonProps}
            value={String(formField.value)}
            keyfilter="alpha"
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
          />
        )

      case "calendar":
        return (
          <Calendar
            {...commonProps}
            value={formField.value ? new Date(formField.value) : undefined}
            onChange={e => {
              formField.onChange(e.value)
            }}
            dateFormat={field.format ?? "mm/dd/yy"}
            showIcon
          />
        )

      case "select":
        return (
          <Dropdown
            {...commonProps}
            value={formField.value}
            options={field.options ?? []}
            onChange={e => {
              formField.onChange(e.value)
            }}
            optionLabel="label"
          />
        )
    }
  }

  const renderFormField = (field: ClinicForm<ClinicResponse>) => (
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
        disabled={isSubmitting}
      />
      <Button
        type="submit"
        form="updateClinicForm"
        label="Guardar"
        icon="pi pi-check"
        loading={isSubmitting}
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
        header="Actualizar una clínica"
        footer={renderFooter()}
        visible={showUpdateDialog}
        onHide={handleClose}
        className="w-xl"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        closable={!isSubmitting}
        style={{ minWidth: "30rem" }}
      >
        {isLoading ? (
          <div className="flex justify-content-center">
            <i
              className="pi pi-spin pi-spinner"
              style={{ fontSize: "2rem" }}
            ></i>
          </div>
        ) : (
          <form
            id="updateClinicForm"
            onSubmit={handleFormSubmit}
            className="p-fluid"
          >
            {formFields.map(renderFormField)}
          </form>
        )}
      </Dialog>
    </>
  )
}

export default UpdateClinicComponent
