import { User } from "./user";

export interface CampaignMember {
  id: number,
  campaignId: number,
  user: User,
  role: CampaignMemberRole,
  joinedAt: string
}

export enum CampaignMemberRole {
  OWNER = "OWNER",
  PLAYER = "PLAYER"
}