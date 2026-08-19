export interface CampaignInvite {
  id: number,
  email: string,
  status: CampaignInviteStatus,
  expiresAt: string,
  createdAt: string
}

enum CampaignInviteStatus {
  PENDING,
  ACCEPTED,
  DECLINED
}