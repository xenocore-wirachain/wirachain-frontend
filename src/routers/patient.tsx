import { Navigate } from "react-router"
import { ListAppointment, ListClinic, Profile } from "../features/patient"

const PatientRouter = [
  {
    path: "",
    element: <Navigate replace to="/dashboard/appointment-list" />,
  },
  {
    path: "appointment-list",
    element: <ListAppointment />,
  },
  {
    path: "clinic-list",
    element: <ListClinic />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
]

export { PatientRouter }
