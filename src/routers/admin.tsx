import type { RouteObject } from "react-router"
import { ListClinicAdmin } from "../features/admin"

const AdminRouter: RouteObject[] = [
  {
    path: "admin/clinic-admin-list",
    element: <ListClinicAdmin />,
  },
]

export { AdminRouter }
