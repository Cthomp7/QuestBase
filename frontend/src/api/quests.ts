
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