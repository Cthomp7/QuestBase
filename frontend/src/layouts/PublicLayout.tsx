import Header from "@/components/Header/Header"
import { Outlet } from "react-router-dom"


const PublicLayout = () => {
  return (
    <>
      <Header></Header>
      <main>
        <Outlet />
      </main>
    </>
  )
}

export default PublicLayout