import DashboardNavigation from "@/components/DashboardNavigation/DashboardNavigation"
import { Outlet } from "react-router-dom"
import styles from "./AuthLayout.module.css"

const AuthLayout = () => {
  return (
    <main className={styles.dashboard_main_layout}>
      <DashboardNavigation></DashboardNavigation>
      <div className={styles.main_content}>
        <Outlet />
      </div>
    </main>
  )
}

export default AuthLayout