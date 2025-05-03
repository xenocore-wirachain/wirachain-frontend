import { Navigate } from "react-router"
import ListClinicAdmin from "../features/admin/ClinicAdmin/ListClinicAdmin"

const AdminRouter = [
  {
    path: "",
    element: <Navigate replace to="/dashboard/list-clinic-admin" />,
  },
  {
    path: "list-clinic-admin",
    element: <ListClinicAdmin />,
  },
]

export { AdminRouter }
