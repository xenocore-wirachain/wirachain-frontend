import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { InputText } from "primereact/inputtext"
import { Password } from "primereact/password"
import { Controller, useForm } from "react-hook-form"
import { useNavigate } from "react-router"
import type { Credentials } from "../../types/Credentials"

function Login() {
  const defaultValues: Credentials = {
    username: "",
    password: "",
  }
  const {
    control,
    formState: { errors },
    reset,
    handleSubmit,
  } = useForm<Credentials>({ defaultValues })
  const navigate = useNavigate()

  const onSubmit = (data: Credentials) => {
    console.log("CREDENTIALS", data)
    reset()
    void navigate("dashboard")
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void handleSubmit(onSubmit)(e as React.BaseSyntheticEvent)
  }

  const handleRedirectRegister = () => {
    void navigate("/register")
  }

  const handleRedirectRestore = () => {
    void navigate("/reset-pass")
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Bienvenido</h1>
          <p className="text-gray-600 mt-2">Inicia sesión para continuar</p>
        </div>

        <form id="register" onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-2">
              Correo
            </label>
            <Controller
              control={control}
              name="username"
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
                  invalid={errors.username ? true : false}
                  // disabled={isLoading}
                  placeholder="Ingrese su correo"
                  className="w-full p-inputtext-lg"
                />
              )}
            />
            {errors.username && (
              <small className="text-red-500">
                {errors.username.message?.toString()}
              </small>
            )}
          </div>

          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-2">
              Contraseña
            </label>
            <Controller
              control={control}
              name="password"
              rules={{ required: "Se requiere contraseña" }}
              render={({ field: { onChange, onBlur, value, ref } }) => (
                <Password
                  toggleMask
                  feedback={false}
                  onBlur={onBlur}
                  onChange={onChange}
                  value={value}
                  ref={ref}
                  invalid={errors.password ? true : false}
                  placeholder="Ingrese su contraseña"
                  inputClassName="w-full p-inputtext-lg"
                  // disabled={isLoading}
                />
              )}
            />
            {errors.password && (
              <small className="text-red-500">
                {errors.password.message?.toString()}
              </small>
            )}
          </div>

          <Button
            label="Iniciar sesión"
            className="w-full mt-2 bg-blue-600 hover:bg-blue-700"
            size="large"
            type="submit"
            form="register"
          />
        </form>

        <Divider align="center">
          <span className="text-gray-500 px-2">o</span>
        </Divider>

        <Button
          label="Registrate"
          className="w-full p-button-outlined mt-2"
          size="large"
          type="button"
          onClick={handleRedirectRegister}
        />

        <div className="flex justify-center mt-8 text-sm">
          <a
            onClick={handleRedirectRestore}
            className="text-blue-600 hover:text-blue-800"
          >
            Recupera tu contraseña
          </a>
        </div>
      </Card>
    </div>
  )
}

export default Login
