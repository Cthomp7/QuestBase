export interface CampaignInvite {
  id: number,
  email: string,
  status: CampaignInviteStatus,
  expiresAt: string,
  createdAt: string
}

export enum CampaignInviteStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  DECLINED = "DECLINED"
}

export interface CampaignInviteDetails {
  status: CampaignInviteStatus,
  expiresAt: string,
  campaignName: string
}