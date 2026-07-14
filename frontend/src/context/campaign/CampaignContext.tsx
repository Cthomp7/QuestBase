import type { Campaign } from "@/types/api/campaign";
import { createContext, type Dispatch, type SetStateAction } from "react";

interface CampaignContextType {
  campaigns: Campaign[]
  setCampaigns: Dispatch<SetStateAction<Campaign[]>>
  activeCampaign: Campaign | null
  setActiveCampaign: (campaign: Campaign | null) => void
  activeCampaignId: string
  setActiveCampaignId: (campaignId: string) => void
  clearActiveCampaign: () => void
}

export const CampaignContext =
  createContext<CampaignContextType | undefined>(undefined)