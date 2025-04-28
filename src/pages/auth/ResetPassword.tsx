import "primeicons/primeicons.css"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { InputText } from "primereact/inputtext"
import "primereact/resources/primereact.min.css"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import type { ForgotPassword } from "../../types/Credentials"

function ResetPassword() {
  const defaultValues: ForgotPassword = {
    email: "",
  }
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<ForgotPassword>({ defaultValues })
  const navigate = useNavigate()

  const onSubmit = (data: ForgotPassword) => {
    console.log("CREDENTIALS", data)
    reset()
  }

  const handleRedirectLogin = () => {
    void navigate("/")
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(onSubmit)(e as React.BaseSyntheticEvent)
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Olvidaste tu contraseña
          </h1>
          <p className="text-gray-600 mt-2">
            Ingresa tu correo y nosotros se enviaremos las instrucciones para
            recuperar tu contraseña
          </p>
        </div>
        <form id="forgotPass" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Correo
            </label>
            <Controller
              control={control}
              name="email"
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
                  invalid={errors.email ? true : false}
                  // disabled={isLoading}
                  placeholder="Ingrese su correo"
                  className="w-full p-inputtext-lg"
                />
              )}
            />
            {errors.email && (
              <small className="text-red-500">
                {errors.email.message?.toString()}
              </small>
            )}
          </div>

          <Button
            label="Enviar correo"
            size="large"
            form="forgotPass"
            className="w-full mt-4 bg-blue-600 hover:bg-blue-700"
            type="submit"
          />

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Ya recordaste tu contraseña?{" "}
              <a
                onClick={handleRedirectLogin}
                className="text-blue-600 hover:underline font-medium"
              >
                Vuelve al inicio de sesión
              </a>
            </p>
          </div>
        </form>
      </Card>
    </div>
  )
}

export default ResetPassword
