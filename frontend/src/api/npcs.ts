import { NpcQuest } from "@/types/api/questnpc"

export async function fetchNpcs (campaignId: number) {
  if (!campaignId) {
    console.error("Campaign ID required to fetch NPCs.")
    return null
  }
  try {
    const response = await fetch(
      `/api/campaigns/${campaignId}/npcs`,
      { method: "GET" }
    )
    if (response.ok) {
      const quests = await response.json()
      return quests
    } else {
      console.error(response)
    }
  } catch (error) {
    console.error("Failed to fetch NPCs: ", error)
  }
}

export async function fetchQuestsForNpc (npcId: number) {
  try {
    const response = await fetch(
      `/api/npcs/${npcId}/quests`,
      { method: "GET" }
    )
    if (response.ok) {
      const quests: NpcQuest[] = await response.json()
      return quests
    } else {
      console.error(response)
    }
  } catch (error) {
    console.error("Failed to fetch NPC's quests: ", error)
  }
}