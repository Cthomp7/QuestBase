import { NpcQuest } from "@/types/api/questnpc"

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
    console.error("Failed to create quest NPC: ", error)
  }
}