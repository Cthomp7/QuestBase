import { User } from "./user";

export interface CampaignMember {
  id: number,
  campaignId: number,
  user: User,
  role: CampaignMemberRole,
  joinedAt: string
}

enum CampaignMemberRole {
  OWNER,
  PLAYER
}