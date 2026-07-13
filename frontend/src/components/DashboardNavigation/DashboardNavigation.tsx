import { useNavigate } from "react-router-dom"
import styles from "./DashboardNavigation.module.css"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import { Campaign } from "@/types/api/campaign"
import Dropdown, { DropdownOption } from "@/components/Dropdown/Dropdown"

const DashboardNavigation = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [selectedCampaign, setSelectedCampaign] = useState<string>("")
  const [campaignDropdownOptions, setCampaignDropdownOptions] = useState<DropdownOption[]>([])

  const pages = [
    // { name: "Characters", url: "/characters" },
    // { name: "Items", url: "/items" },
    { name: "Quests", url: "/quests" }
  ]

  useEffect(() => {
    fetchCampaigns()
  },[user])

  // configure dropdown
  useEffect(() => {
    const selected = localStorage.getItem("selectedCampaign") ?? ""
    const options = campaigns.map((campaign) => ({
      label: campaign.name,
      value: String(campaign.id),
    }))
    setCampaignDropdownOptions(options)
    if (selected) setSelectedCampaign(selected)
  },[campaigns])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns", { method: "GET" })
      const json = await response.json()
      setCampaigns(json)
    } catch (error) {
      console.error("Failed to fetch campaigns: ", error)
    }
  }

  const switchCampaign = (campaign: string) => {
    setSelectedCampaign(campaign)
    localStorage.setItem("selectedCampaign", campaign);
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
          value={selectedCampaign}
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