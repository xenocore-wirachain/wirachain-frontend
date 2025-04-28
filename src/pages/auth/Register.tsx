import "primeicons/primeicons.css"
import { Button } from "primereact/button"
import { Card } from "primereact/card"
import { Divider } from "primereact/divider"
import { InputText } from "primereact/inputtext"
import "primereact/resources/primereact.min.css"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import { classNames } from "primereact/utils"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router"

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [acceptTerms, setAcceptTerms] = useState<boolean>(false)

  const [errors, setErrors] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    password: false,
    confirmPassword: false,
    terms: false,
    passwordMatch: false,
  })

  const handleRedirectLogin = () => {
    void navigate("/")
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when typing
    setErrors(prev => ({
      ...prev,
      [name]: false,
      ...(name === "confirmPassword" || name === "password"
        ? { passwordMatch: false }
        : {}),
    }))
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = {
      name: !formData.name,
      email: !formData.email,
      password: !formData.password,
      confirmPassword: !formData.confirmPassword,
      terms: !acceptTerms,
      passwordMatch:
        formData.password !== formData.confirmPassword &&
        Boolean(formData.password && formData.confirmPassword),
    }

    setErrors(newErrors)

    if (!Object.values(newErrors).some(Boolean)) {
      // Here you would handle the actual registration logic
      console.log("Registration attempt with:", { ...formData, acceptTerms })
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md p-4 shadow-lg">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Registrate ahora</h1>
          <p className="text-gray-600 mt-2">
            Unetenos y accede a todas las herramientas
          </p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 mb-2">
              Nombre completo
            </label>
            <InputText
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              size="small"
              className={classNames("w-full", {
                "p-invalid": errors.name,
              })}
              placeholder="Your full name"
            />
            {errors.name && (
              <small className="text-red-500">Name is required.</small>
            )}
          </div>

          <Button
            label="Register"
            size="small"
            className="w-full  mt-2 bg-blue-600 hover:bg-blue-700"
            type="submit"
          />
        </form>

        <Divider align="center" />

        <div className="text-center mt-4">
          <p className="text-gray-600">
            Ya tienes una cuenta?{" "}
            <a
              onClick={handleRedirectLogin}
              className="text-blue-600 hover:underline font-medium"
            >
              Inicia sesión
            </a>
          </p>
        </div>
      </Card>
    </div>
  )
}

export default Register
