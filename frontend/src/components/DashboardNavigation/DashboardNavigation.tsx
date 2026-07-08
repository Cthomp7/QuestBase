import { useNavigate } from "react-router-dom"
import styles from "./DashboardNavigation.module.css"

const DashboardNavigation = () => {
  const navigate = useNavigate()

  const pages = [
    // { name: "Characters", url: "/characters" },
    // { name: "Items", url: "/items" },
    { name: "Quests", url: "/quests" }
  ]

  return (
    <div className={styles.dashboard_navigation}>
      <section>
        <h1>QuestBase </h1>
      </section>
      <section className={styles.navigation_section}>
        <p className={styles.campaign_name}>Campaign Name</p>
        <hr />
      </section>
      <section className={styles.navigation_pages}>
        {pages.map((p) => (
          <div
            key={p.url}
            className={styles.navigation_page}
            onClick={() => navigate(p.url)}
          >
            <p>{p.name}</p>
          </div>
        ))}
      </section>
    </div>
  )
}

export default DashboardNavigation