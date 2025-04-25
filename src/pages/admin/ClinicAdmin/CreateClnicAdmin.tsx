import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { Toast } from "primereact/toast"
import { classNames } from "primereact/utils"
import React, { useState } from "react"
import { Controller, useForm } from "react-hook-form"
import {
  modifyCreateDialog,
  useAppDispatch,
  useAppSelector,
} from "../../../redux"
import type { ClinicAdminRequest } from "../../../types/ClinicAdmin"
import type { MultiFuntionalForm } from "../../../types/Form"
import RenderEachInput from "../../../utils/RenderEachInput"
import { formClinicAdmin } from "./formClinicAdmin"

const CreateClnicAdmin: React.FC = () => {
  const dispatch = useAppDispatch()
  const showCreateDialog = useAppSelector(
    state => state.dataTable.showCreateDialog,
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const toastRef = React.useRef<Toast>(null)

  const defaultValues: ClinicAdminRequest = {
    firstName: "",
    lastName: "",
    gender: "male",
    dateOfBirth: new Date(),
    name: "",
    phone: "000-000-000",
    email: "",
    password: "",
  }

  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ClinicAdminRequest>({ defaultValues })

  const handleClose = () => {
    dispatch(modifyCreateDialog(false))
    reset()
  }

  const renderFormField = (field: MultiFuntionalForm<ClinicAdminRequest>) => (
    <div className="field mt-4" key={field.name}>
      <span className="p-float-label">
        <Controller
          name={field.name}
          control={control}
          rules={field.rules}
          render={({ field: formField, fieldState }) =>
            RenderEachInput<ClinicAdminRequest>(
              field,
              formField,
              fieldState,
              isSubmitting,
            )
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
        form="createClinicForm"
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
        header="Crear una clínica"
        footer={renderFooter()}
        visible={showCreateDialog}
        onHide={handleClose}
        className="w-xl"
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        closable={!isSubmitting}
      >
        <form
          id="createClinicForm"
          onSubmit={handleFormSubmit}
          className="p-fluid"
        >
          {formClinicAdmin.map(renderFormField)}
        </form>
      </Dialog>
    </>
  )
}

export default CreateClnicAdmin
