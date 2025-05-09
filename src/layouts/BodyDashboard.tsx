import { ScrollPanel } from "primereact/scrollpanel"
import { Outlet } from "react-router"
import GlobalToast from "../components/GlobalToast"
import BaseMenu from "./BaseMenu"

function BodyDashboard() {
  return (
    <div className="max-h-screen max-w-screen flex flex-col">
      <GlobalToast />
      <div className="w-full basis-[5vh] px-8 py-4">
        <BaseMenu />
      </div>
      <ScrollPanel className="w-full basis-[95vh] px-8">
        <Outlet />
      </ScrollPanel>
    </div>
  )
}

export default BodyDashboard
