import { CampaignMemberRole } from "./campaignMember"

export interface Campaign {
  id: number,
  name: string,
  system: string,
  description: string
  role: CampaignMemberRole
}