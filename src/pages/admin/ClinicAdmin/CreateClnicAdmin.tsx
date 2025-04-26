import { Button } from "primereact/button"
import { Dialog } from "primereact/dialog"
import { InputMask } from "primereact/inputmask"
import { InputText } from "primereact/inputtext"
import { classNames } from "primereact/utils"
import { Controller, useForm } from "react-hook-form"
import {
  modifyCreateDialog,
  useAddClinicAdminMutation,
  useAppDispatch,
  useAppSelector,
} from "../../../redux"
import type { ClinicAdminRequest } from "../../../types/ClinicAdmin"

function CreateClinicAdmin() {
  const dispatch = useAppDispatch()
  const showCreateDialog = useAppSelector(
    state => state.dataTable.showCreateDialog,
  )
  const [createClinicAdmin, { isLoading }] = useAddClinicAdminMutation()
  const defaultValues: ClinicAdminRequest = {
    firstName: "",
    lastName: "",
    gender: "male",
    dateOfBirth: new Date(),
    user: {
      name: "",
      phone: "",
      email: "",
      password: "",
    },
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

  const onSubmit = (data: ClinicAdminRequest) => {
    console.log("THIS IS THE DATA", data)
    reset()
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
          <div className="field mt-4" key="firstName">
            <span className="p-float-label">
              <Controller
                name="firstName"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="alpha"
                    invalid={errors.firstName ? true : false}
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
              <small className="p-error">Se requiere nombre</small>
            )}
          </div>

          {/* APELLIDO */}
          <div className="field mt-4" key="lastName">
            <span className="p-float-label">
              <Controller
                name="lastName"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="alpha"
                    invalid={errors.lastName ? true : false}
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
              <small className="p-error">Se requiere apellido</small>
            )}
          </div>

          {/* GENDER */}

          {/* DATE OF BIRTH */}

          {/* NAME */}
          <div className="field mt-4" key="name">
            <span className="p-float-label">
              <Controller
                name="user.name"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="alpha"
                    invalid={errors.user?.name ? true : false}
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
              <small className="p-error">Se requiere usuario</small>
            )}
          </div>

          {/* PHONE */}
          <div className="field mt-4" key="phone">
            <span className="p-float-label">
              <Controller
                name="user.phone"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputMask
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.user?.phone ? true : false}
                    mask="999-999-999"
                    placeholder="000-000-000"
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
              <small className="p-error">Se requiere telefono</small>
            )}
          </div>

          {/* EMAIL */}
          <div className="field mt-4" key="mail">
            <span className="p-float-label">
              <Controller
                name="user.email"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    keyfilter="email"
                    invalid={errors.user?.email ? true : false}
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
              <small className="p-error">Se requiere correo</small>
            )}
          </div>

          {/* PASSWORD */}
          <div className="field mt-4" key="password">
            <span className="p-float-label">
              <Controller
                name="user.password"
                control={control}
                rules={{ required: true }}
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <InputText
                    onBlur={onBlur}
                    onChange={onChange}
                    value={value}
                    ref={ref}
                    invalid={errors.user?.password ? true : false}
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
              <small className="p-error">Se requiere contraseña</small>
            )}
          </div>
        </form>
      </Dialog>
    </>
  )
}

export default CreateClinicAdmin
