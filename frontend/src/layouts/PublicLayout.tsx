import Navigation from "@/components/Navigation/Navigation"
import { Outlet } from "react-router-dom"


const PublicLayout = () => {
  return (
    <>
      <Navigation></Navigation>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default PublicLayout