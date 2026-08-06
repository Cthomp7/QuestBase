import { useEffect, useState, type ReactNode } from "react"
import { CampaignContext } from "./CampaignContext"
import type { Campaign } from "@/types/api/campaign"
import { useAuth } from "../AuthContext";

interface CampaignProviderProps {
  children: ReactNode;
}

export const CampaignProvider = ({
  children,
}: CampaignProviderProps) => {
  const { user } = useAuth()
  const [activeCampaign, setActiveCampaign] = useState<Campaign | null>(null)
  const [activeCampaignId, setActiveCampaignId] =
    useState<string>(() => {
      const campaignId = localStorage.getItem("activeCampaign")
      if (!campaignId) return ""
      else return campaignId
    })
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    if (user) fetchCampaigns()
  }, [user])

  useEffect(() => {
    if (campaigns.length > 0 && activeCampaignId) {
      const campaign = campaigns.find(campaign => campaign.id === Number(activeCampaignId))
      if (!campaign) {
        console.error(`Failed to find campaign with matching id: ${activeCampaignId}`)
        setActiveCampaign(null)
      } else setActiveCampaign(campaign)
    }
  }, [campaigns, activeCampaignId])

  const fetchCampaigns = async () => {
    try {
      const response = await fetch("/api/campaigns", { method: "GET" })
      if (response.ok) {
        const json = await response.json()
        setCampaigns(json)
      } else console.error(response)
    } catch (error) {
      console.error("Failed to fetch campaigns: ", error)
    }
  }

  const clearActiveCampaign = () => {
    setActiveCampaign(null)
  }

  return (
    <CampaignContext.Provider
      value={{
        campaigns,
        setCampaigns,
        activeCampaign,
        setActiveCampaign,
        activeCampaignId,
        setActiveCampaignId,
        clearActiveCampaign,
      }}
    >
      {children}
    </CampaignContext.Provider>
  )
}