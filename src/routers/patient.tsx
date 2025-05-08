import type { RouteObject } from "react-router"
import { ListAppointment, ListClinic, Profile } from "../features/patient"

const PatientRouter: RouteObject[] = [
  {
    path: "patient/appointment-list",
    element: <ListAppointment />,
  },
  {
    path: "patient/clinic-list",
    element: <ListClinic />,
  },
  {
    path: "patient/profile",
    element: <Profile />,
  },
]

export { PatientRouter }
