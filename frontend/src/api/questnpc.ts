import { CreateQuestNpcRequest, UpdateQuestNpcRequest } from "@/types/api/questnpc"

export async function createQuestNpc(
  request: CreateQuestNpcRequest
) {
  try {
    validateQuestNpc(request)
    const response = await fetch(`/api/quest-npcs`, { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      }
    )
    if (response.ok) {
      const questNpc = await response.json()
      return questNpc
    } else {
      console.error(response)
    }
  } catch (error) {
    console.error("Failed to create quest NPC: ", error)
  }
}

export async function updateQuestNpc(
  npcId: number,
  request: UpdateQuestNpcRequest
) {
  try { 
    const response = await fetch(`/api/quest-npcs/${npcId}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request)
      }
    )
    if (response.ok) {
      const questNpc = await response.json()
      return questNpc
    } else {
      console.error(response)
    }
  } catch (error) {
    console.error("Failed to update quest NPC: ", error)
  }
}

export async function deleteQuestNpc(npcId: number) {
  try { 
    const response = await fetch(`/api/quest-npcs/${npcId}`, 
      { method: "DELETE" }
    )
    if (!response.ok) {
      console.error(response)
    }
  } catch (error) {
    console.error("Failed to delete quest NPC: ", error)
  }
}

function validateQuestNpc (request: CreateQuestNpcRequest) {
  if (!request.questId) {
    throw new Error('Quest ID is required to create an quest NPC.')
  } else if (!request.npcId) {
    throw new Error('NPC ID is required to create an quest NPC.')
  }
}