import { Button } from "primereact/button"
import { Calendar } from "primereact/calendar"
import { Dialog } from "primereact/dialog"
import { Dropdown } from "primereact/dropdown"
import { InputMask } from "primereact/inputmask"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { Toast } from "primereact/toast"
import { classNames } from "primereact/utils"
import React from "react"
import { Controller, useForm } from "react-hook-form"
import {
  modifyCreateDialog,
  useAppDispatch,
  useAppSelector,
  useGetClinicAdminQuery,
  useUpdateClinicAdminMutation,
} from "../../../redux"
import type { ClinicAdminRequest } from "../../../types/ClinicAdmin"

type Gender = {
  id: number
  value: string
}

const GenderDictionary: Gender[] = [
  { id: 1, value: "Hombre" },
  { id: 2, value: "Mujer" },
]

function UpdateClinicAdmin() {
  const dispatch = useAppDispatch()
  const { showUpdateDialog, idSelected } = useAppSelector(
    state => state.dataTable,
  )
  const [updateClinicAdmin, { isLoading }] = useUpdateClinicAdminMutation()
  const [getClinicAdmin] = useGetClinicAdminQuery(idSelected)
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ClinicAdminRequest>({
    defaultValues: async () => await getClinicAdmin(),
  })
  const toastRef = React.useRef<Toast>(null)

  const handleClose = () => {
    dispatch(modifyCreateDialog(false))
    reset()
  }

  const onSubmit = (data: ClinicAdminRequest) => {
    if (data.dateOfBirth instanceof Date) {
      data.dateOfBirth = data.dateOfBirth.toISOString()
    } else {
      throw new Error("dateOfBirth must be a Date object to call toISOString()")
    }
    data.gender = data.gender === "Hombre" ? "male" : "female"

    void createClinicAdmin(data)
      .unwrap()
      .then(() => {
        toastRef.current?.show({
          severity: "success",
          summary: "Éxito",
          detail: "Administrador de clinica creado correctamente",
        })
        handleClose()
      })
      .catch((error: unknown) => {
        const errorMessage =
          error instanceof Error ? error.message : "Error desconocido"

        toastRef.current?.show({
          severity: "error",
          summary: "Error",
          detail: `No se pudo crear la administrador de clinica: ${errorMessage}`,
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
        visible={showUpdateDialog}
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
          <div className="field mt-4" key="firstName">
            <span className="p-float-label">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: "Se requiere nombre" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="alpha"
                    invalid={errors.firstName ? true : false}
                    disabled={isLoading}
                  />
                )}
              />
              <label
                htmlFor="firstNmae"
                className={classNames({ "p-error": errors.firstName })}
              >
                Nombre
              </label>
            </span>
            {errors.firstName && (
              <small className="p-error">
                {errors.firstName.message?.toString()}
              </small>
            )}
          </div>

          {/* APELLIDO */}
          <div className="field mt-4" key="lastName">
            <span className="p-float-label">
              <Controller
                name="lastName"
                control={control}
                rules={{ required: "Se requiere apellido" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="alpha"
                    invalid={errors.lastName ? true : false}
                    disabled={isLoading}
                  />
                )}
              />
              <label
                htmlFor="lastName"
                className={classNames({ "p-error": errors.lastName })}
              >
                Apellido
              </label>
            </span>
            {errors.lastName && (
              <small className="p-error">
                {errors.lastName.message?.toString()}
              </small>
            )}
          </div>

          {/* GENDER */}
          <div className="field mt-4" key="gender">
            <span className="p-float-label">
              <Controller
                name="gender"
                control={control}
                rules={{ required: "Se requiere genero" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Dropdown
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.gender ? true : false}
                    options={GenderDictionary}
                    disabled={isLoading}
                    optionLabel="value"
                  />
                )}
              />
              <label
                htmlFor="gender"
                className={classNames({ "p-error": errors.gender })}
              >
                Genero
              </label>
            </span>
            {errors.gender && (
              <small className="p-error">
                {errors.gender.message?.toString()}
              </small>
            )}
          </div>

          {/* DATE OF BIRTH */}
          <div className="field mt-4" key="birth">
            <span className="p-float-label">
              <Controller
                name="dateOfBirth"
                control={control}
                rules={{ required: "Se requiere fecha de nacimiento" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Calendar
                    readOnlyInput
                    onBlur={onBlur}
                    onChange={onChange}
                    value={
                      value instanceof Date || value === null ? value : null
                    }
                    ref={ref}
                    invalid={errors.dateOfBirth ? true : false}
                    maxDate={new Date()}
                    disabled={isLoading}
                  />
                )}
              />
              <label
                htmlFor="birth"
                className={classNames({ "p-error": errors.firstName })}
              >
                Fecha de nacimiento
              </label>
            </span>
            {errors.dateOfBirth && (
              <small className="p-error">
                {errors.dateOfBirth.message?.toString()}
              </small>
            )}
          </div>

          {/* NAME */}
          <div className="field mt-4" key="name">
            <span className="p-float-label">
              <Controller
                name="user.name"
                control={control}
                rules={{ required: "Se requiere usuario" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="alpha"
                    invalid={errors.user?.name ? true : false}
                    disabled={isLoading}
                  />
                )}
              />
              <label
                htmlFor="name"
                className={classNames({ "p-error": errors.user?.name })}
              >
                Usuario
              </label>
            </span>
            {errors.user?.name && (
              <small className="p-error">
                {errors.user.name.message?.toString()}
              </small>
            )}
          </div>

          {/* PHONE */}
          <div className="field mt-4" key="phone">
            <span className="p-float-label">
              <Controller
                name="user.phone"
                control={control}
                rules={{ required: "Se requiere telefono" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputMask
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.user?.phone ? true : false}
                    mask="999-999-999"
                    placeholder="000-000-000"
                    disabled={isLoading}
                  />
                )}
              />
              <label
                htmlFor="phone"
                className={classNames({ "p-error": errors.user?.phone })}
              >
                Telefono
              </label>
            </span>
            {errors.user?.phone && (
              <small className="p-error">
                {errors.user.phone.message?.toString()}
              </small>
            )}
          </div>

          {/* EMAIL */}
          <div className="field mt-4" key="mail">
            <span className="p-float-label">
              <Controller
                name="user.email"
                control={control}
                rules={{
                  required: "Se requiere correo",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Correo invalido",
                  },
                }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="email"
                    invalid={errors.user?.email ? true : false}
                    disabled={isLoading}
                  />
                )}
              />
              <label
                htmlFor="mail"
                className={classNames({ "p-error": errors.user?.email })}
              >
                Correo
              </label>
            </span>
            {errors.user?.email && (
              <small className="p-error">
                {errors.user.email.message?.toString()}
              </small>
            )}
          </div>

          {/* PASSWORD */}
          <div className="field mt-4" key="password">
            <span className="p-float-label">
              <Controller
                name="user.password"
                control={control}
                rules={{ required: "Se requiere contraseña" }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <Password
                    toggleMask
                    feedback={false}
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.user?.password ? true : false}
                    disabled={isLoading}
                  />
                )}
              />
              <label
                htmlFor="password"
                className={classNames({ "p-error": errors.user?.password })}
              >
                Contraseña
              </label>
            </span>
            {errors.user?.password && (
              <small className="p-error">
                {errors.user.password.message?.toString()}
              </small>
            )}
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default UpdateClinicAdmin
