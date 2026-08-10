export interface Npc {
  id: number,
  name: string,
  description: string,
  level: number,
  status: string,
  role: string,
  race: string,
  occupation: string,
  personality: string,
  appearance: string,
  notes: string,
  createdAt: string
}

export interface CreateNpcRequest {
  name: string,
  description: string,
  level: number | undefined,
  status: string,
  role: string,
  race: string,
  occupation: string,
  personality: string,
  appearance: string,
  notes: string,
  campaignId: number
}