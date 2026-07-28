import { Campaign } from "./campaign";

export interface Quest {
  id: number,
  title: string,
  description: string,
  status: string,
  difficulty: string,
  rewardXp: string,
  createdAt: string,
  campaign: Campaign
}

export interface CreateQuestRequest {
  title: string,
  description: string,
  status: string,
  difficulty: string,
  rewardXp: number,
  campaignId: number
}