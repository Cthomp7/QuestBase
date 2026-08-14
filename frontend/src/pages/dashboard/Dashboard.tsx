import { fetchQuests } from "@/api/quests"
import CampaignEmptyState from "@/components/states/CampaignEmptyState/CampaignEmptyState"
import PageHeader from "@/components/ui/PageHeader/PageHeader"
import { useCampaign } from "@/context/campaign/useCampaign"
import styles from "./Dashboard.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { Quest as QuestType } from "@/types/api/quest"
import { useCallback, useEffect, useState } from "react"
import Quest from "../quests/Quest"
import { useNavigate } from "react-router-dom"
import { Book, CircleArrowLeft, SquareUser } from "lucide-react"
import { fetchNpcs } from "@/api/npcs"
import { Npc as NpcType } from "@/types/api/npc"
import Npc from "../npcs/Npc"

const Dashboard = () => {
  const navigate = useNavigate()
  const { activeCampaign, campaigns } = useCampaign()
  const [ quests, setQuests ] = useState<QuestType[]>([])
  const [ npcs, setNpcs ] = useState<NpcType[]>([])

  const handleFetchQuests = useCallback(async () => {
    if (!activeCampaign?.id) return
    try {
      const quests = await fetchQuests(activeCampaign.id)
      if (quests) setQuests(quests)
    } catch (error) {
      console.error("Failed to fetch quests: ", error)
    }
  }, [activeCampaign?.id])

  const handleFetchNpcs = useCallback(async () => {
    if (!activeCampaign?.id) return
    try {
      const npcs = await fetchNpcs(activeCampaign.id)
      if (npcs) setNpcs(npcs)
    } catch (error) {
      console.error("Failed to fetch NPCs: ", error)
    }
  }, [activeCampaign?.id])

  useEffect(() => {
    if (campaigns.length > 0 && activeCampaign) {
      handleFetchQuests()
      handleFetchNpcs()
    }
  },[activeCampaign, campaigns, handleFetchQuests, handleFetchNpcs])

  return (
    <div className={layoutStyles.page_container}>
      <PageHeader title="Dashboard" activeCampaign={activeCampaign}/>
      {campaigns.length > 0 && activeCampaign ? (
        <div className={styles.section_container}>
          <section className={styles.section}>
            <div className={styles.section_header}>
              <Book/>
              <h2>Questboard</h2>
            </div>
            {quests.length > 0 ? (
              <>
                <div className={styles.quests_container}>
                  {quests.map((quest, i) => (
                    <Quest 
                      key={i}
                      quest={quest}
                      index={i}
                      editable={false}
                    />
                  ))}
                </div>
                <button
                  className={layoutStyles.periwinkle_button}
                  onClick={() => navigate("/quests")}
                >
                  <CircleArrowLeft/>
                  <p>Go to quests</p>
                </button>
              </>
            ) : (
              <div className={styles.no_entries_container}>
                <p className={styles.no_entries_title}>Your <span>questboard</span> is empty.</p>
                <p><i>Every adventure has to start somewhere...</i></p>
                <button 
                  className={layoutStyles.green_button}
                  onClick={() => navigate("/quests")}
                >Create a Quest</button>
              </div>
            )}
          </section>

          <section className={styles.section}>
            <div className={styles.section_header}>
              <SquareUser/>
              <h2>Recent Encounters</h2>
            </div>
            {npcs.length > 0 ? (
              <>
                <div className={styles.quests_container}>
                  {npcs.map((npc) => (
                    <Npc 
                      key={npc.id}
                      npc={npc}
                    />
                  ))}
                </div>
                <button
                  className={layoutStyles.periwinkle_button}
                  onClick={() => navigate("/npcs")}
                >
                  <CircleArrowLeft/>
                  <p>Go to NPCs</p>
                </button>
              </>
            ) : (
              <div className={styles.no_entries_container}>
                <p className={styles.no_entries_title}>Your <span>recent encounters</span> are empty.</p>
                <p><i>Someone has to give out all those quests...</i></p>
                <button 
                  className={layoutStyles.green_button}
                  onClick={() => navigate("/quests")}
                >Create an NPC</button>
              </div>
            )}
          </section>
        </div>
      ) : (
        <CampaignEmptyState type={"your dashboard"}/>
      )}
    </div>
  )
}

export default Dashboard