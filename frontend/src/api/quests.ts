import { QuestNpc } from "@/types/api/questnpc";

export async function fetchQuests (campaignId: number) {
  if (!campaignId) {
    console.error("Campaign ID required to fetch quests.")
    return null
  }
  try {
    const response = await fetch(
      `/api/campaigns/${campaignId}/quests`,
      { method: "GET" }
    );

    if (response.ok) {
      const quests = await response.json();
      return quests
    } else {
      console.error(response);
    }
  } catch (error) {
    console.error("Failed to fetch quests: ", error);
  }
}

export async function fetchNpcsForQuest (questId: number) {
  try {
    const response = await fetch(
      `/api/quests/${questId}/npcs`,
      { method: "GET" }
    )
    if (response.ok) {
      const npcs: QuestNpc[] = await response.json()
      return npcs
    } else {
      console.error(response)
    }
  } catch (error) {
    console.error("Failed to fetch quest's NPCs: ", error)
  }
}