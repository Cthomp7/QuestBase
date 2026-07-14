import { useNavigate } from "react-router-dom"
import styles from "./DashboardNavigation.module.css"
import { useEffect, useState } from "react"
import Dropdown, { DropdownOption } from "@/components/Dropdown/Dropdown"
import { useCampaign } from "@/context/campaign/useCampaign"

const DashboardNavigation = () => {
  const navigate = useNavigate()
  const { campaigns, activeCampaignId, setActiveCampaignId } = useCampaign()
  const [campaignDropdownOptions, setCampaignDropdownOptions] = useState<DropdownOption[]>([])

  const pages = [
    { name: "Quests", url: "/quests" }
  ]

  // configure dropdown
  useEffect(() => {
    if (campaigns.length > 0) {
      const selected = localStorage.getItem("activeCampaignId") ?? ""
      const options = campaigns.map((campaign) => ({
        label: campaign.name,
        value: String(campaign.id),
      }))
      setCampaignDropdownOptions(options)
      if (selected) setActiveCampaignId(selected)
    }
  },[campaigns, setActiveCampaignId])

  const switchCampaign = (id: string) => {
    setActiveCampaignId(id)
    localStorage.setItem("activeCampaignId", id);
  }

  return (
    <div className={styles.dashboard_navigation}>
      <section>
        <h1>QuestBase </h1>
      </section>
      <section className={styles.navigation_section}>
        <div className={styles.campaign_container}>
          <p>Campaign:</p>
          <button onClick={() => navigate("/campaigns")}>view all</button>
        </div>
        <Dropdown
          options={campaignDropdownOptions}
          value={activeCampaignId}
          onChange={(c) => switchCampaign(c)}
        ></Dropdown>
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