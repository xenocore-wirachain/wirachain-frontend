import type { RouteObject } from "react-router"
import {
  ListClinicAdmin,
  ListSpecialty,
  ListStudy,
  Profile,
} from "../features/admin"

const AdminRouter: RouteObject[] = [
  {
    path: "admin/clinic-admin-list",
    element: <ListClinicAdmin />,
  },
  {
    path: "admin/speciality-list",
    element: <ListSpecialty />,
  },
  {
    path: "admin/study-list",
    element: <ListStudy />,
  },
  {
    path: "admin/profile",
    element: <Profile />,
  },
]

export { AdminRouter }
