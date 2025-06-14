import { RoutePaths } from "@/core/route_paths"
import { Navigate } from "react-router"

const EducationDashboard = () => {
  return (
    <>
      <Navigate to={RoutePaths.SEMESTER_LIST} />
    </>
  )
}
export default EducationDashboard
