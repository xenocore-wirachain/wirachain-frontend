import { Button } from "primereact/button"
import { Menu } from "primereact/menu"
import { Menubar } from "primereact/menubar"
import type { MenuItem } from "primereact/menuitem"
import { useRef } from "react"
import { useNavigate } from "react-router"

function BaseMenu() {
  const navigate = useNavigate()
  const profileMenu = useRef<Menu>(null)

  const MenuAdmin: MenuItem[] = [
    {
      label: "Administradores de clinicas",
      icon: "pi pi-users",
      command: () => void navigate("list-clinic-admin"),
    },
  ]

  const MenuClinic: MenuItem[] = [
    {
      label: "Clinic",
      icon: "pi pi-users",
      command: () => void navigate("clinic-list"),
    },
    {
      label: "Doctores",
      icon: "pi pi-users",
      command: () => void navigate("doctor-list"),
    },
    {
      label: "Estudios",
      icon: "pi pi-file-plus",
      command: () => void navigate("study-list"),
    },
    {
      label: "Especialidades",
      icon: "pi pi-bullseye",
      command: () => void navigate("speciality-list"),
    },
    {
      label: "Consultas",
      icon: "pi pi-clipboard",
      command: () => void navigate("history-appointment"),
    },
    {
      label: "Estadisticas",
      icon: "pi pi-chart-pie",
      command: () => void navigate("stadistics"),
    },
  ]

  const MenuDoctor: MenuItem[] = [
    {
      label: "Consultas",
      icon: "pi pi-clipboard",
    },
    {
      label: "Pacientes",
      icon: "pi pi-users",
    },
  ]

  const MenuPatient: MenuItem[] = [
    {
      label: "Consultas",
      icon: "pi pi-clipboard",
    },
    {
      label: "Clinicas",
      icon: "pi pi-building",
    },
  ]

  const profileItems: MenuItem[] = [
    {
      label: "Settings",
      icon: "pi pi-cog",
      command: () => void navigate("profile"),
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: () => {
        console.log("Logging out")
      },
    },
  ]

  const end = (
    <div className="flex flex-wrap align-items-center">
      <Menu model={profileItems} popup ref={profileMenu} />
      <Button
        icon="pi pi-user"
        // className="m-1 p-1 text-gray-700 hover:bg-gray-200 border-gray"
        className="m-1 p-1"
        severity="secondary"
        text
        onClick={event => profileMenu.current?.toggle(event)}
        aria-controls="profile-menu"
        aria-haspopup
      />
    </div>
  )

  return <Menubar model={MenuAdmin} end={end} />
}

export default BaseMenu
