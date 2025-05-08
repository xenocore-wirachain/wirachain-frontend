import { createBrowserRouter, Navigate, Outlet } from "react-router"
import { Login, NotFound, Register, ResetPassword } from "../features/auth"
import { useAuth } from "../features/auth/hooks/UseAuth"
import BodyDashboard from "../layouts/BodyDashboard"
import { USER_TYPES } from "../utils/StaticVariables"
import { AdminRouter } from "./admin"
import { ClinicRouter } from "./clinic"
import { DoctorRouter } from "./doctor"
import { PatientRouter } from "./patient"

const RoleGuard = ({ allowedRoles }: { allowedRoles: number[] }) => {
  const { isAuthenticated, userType } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (!userType || !allowedRoles.includes(userType)) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}

const DashboardWrapper = () => {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return <BodyDashboard />
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/reset-pass",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: <DashboardWrapper />,
    children: [
      {
        path: "",
        element: <DashboardRouter />,
      },
      {
        element: <RoleGuard allowedRoles={[USER_TYPES.ADMIN]} />,
        children: AdminRouter,
      },
      {
        element: <RoleGuard allowedRoles={[USER_TYPES.DOCTOR]} />,
        children: DoctorRouter,
      },
      {
        element: <RoleGuard allowedRoles={[USER_TYPES.PATIENT]} />,
        children: PatientRouter,
      },
      {
        element: <RoleGuard allowedRoles={[USER_TYPES.CLINIC]} />,
        children: ClinicRouter,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
])

function DashboardRouter() {
  const { userType } = useAuth()

  switch (userType) {
    case USER_TYPES.ADMIN:
      return <Navigate to="/dashboard/admin/clinic-admin-list" replace />
    case USER_TYPES.DOCTOR:
      return <Navigate to="/dashboard/doctor/appointment-list" replace />
    case USER_TYPES.PATIENT:
      return <Navigate to="/dashboard/patient/appointment-list" replace />
    case USER_TYPES.CLINIC:
      return <Navigate to="/dashboard/clinic/clinic-list" replace />
    default:
      return <Navigate to="/" replace />
  }
}

export { router }
