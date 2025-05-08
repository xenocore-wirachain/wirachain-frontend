import type { RouteObject } from "react-router"
import {
  HistoryAppoinment,
  ListClinic,
  ListSpecialty,
  ListStudy,
  Profile,
  Stadistics,
} from "../features/clinic"

const ClinicRouter: RouteObject[] = [
  {
    path: "clinic/clinic-list",
    element: <ListClinic />,
  },
  // {
  //   path: "clinic/doctor-list",
  //   element: <ListDoctor />,
  // },
  {
    path: "clinic/speciality-list",
    element: <ListSpecialty />,
  },
  {
    path: "clinic/study-list",
    element: <ListStudy />,
  },
  {
    path: "clinic/history-appointment",
    element: <HistoryAppoinment />,
  },
  {
    path: "clinic/stadistics",
    element: <Stadistics />,
  },
  {
    path: "clinic/profile",
    element: <Profile />,
  },
]

export { ClinicRouter }
