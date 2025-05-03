import { Navigate } from "react-router"
import ListClinic from "../features/clinic/pages/clinic/ListClinic"

const ClinicRouter = [
  {
    path: "",
    element: <Navigate replace to="/dashboard/clinic-list" />,
  },
  {
    path: "clinic-list",
    element: <ListClinic />,
  },
  // {
  //   path: "doctor-list",
  //   element: <ListDoctor />,
  // },
  // {
  //   path: "speciality-list",
  //   element: <ListSpecialty />,
  // },
  // {
  //   path: "study-list",
  //   element: <ListStudy />,
  // },
  // {
  //   path: "history-appointment",
  //   element: <HistoryAppoinment />,
  // },
  // {
  //   path: "stadistics",
  //   element: <Stadistics />,
  // },
  // {
  //   path: "profile",
  //   element: <Profile />,
  // },
]

export { ClinicRouter }
