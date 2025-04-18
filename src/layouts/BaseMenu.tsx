import { Avatar } from "primereact/avatar"
import { Menubar } from "primereact/menubar"
import type { MenuItem } from "primereact/menuitem"

const MenuAdmin: MenuItem[] = [
  {
    label: "Clinicas",
    icon: "pi pi-building",
  },
]

const MenuClinic: MenuItem[] = [
  {
    label: "Doctores",
    icon: "pi pi-users",
  },
  {
    label: "Consultas",
    icon: "pi pi-clipboard",
  },
  {
    label: "Estudios",
    icon: "pi pi-file-plus",
  },
  {
    label: "Especialidades",
    icon: "pi pi-bullseye",
  },
  {
    label: "Estadisticas",
    icon: "pi pi-chart-pie",
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

function BaseMenu() {
  const end = (
    <Avatar
      image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png"
      shape="circle"
    />
  )

  return <Menubar model={MenuAdmin} end={end} />
}

export default BaseMenu
