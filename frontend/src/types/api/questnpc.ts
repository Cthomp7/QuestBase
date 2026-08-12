import { Npc } from "./npc"
import { Quest } from "./quest"

export interface QuestNpc {
  id: number,
  questId: number,
  npcId: number,
  role: string,
  notes: string
  npc: Npc
}

export interface NpcQuest {
  id: number,
  questId: number,
  npcId: number,
  role: string,
  notes: string
  quest: Quest
}

export interface CreateQuestNpcRequest {
  questId: number,
  npcId: number,
  role: string,
  notes: string
}

export interface UpdateQuestNpcRequest {
  role: string,
  notes: string
}