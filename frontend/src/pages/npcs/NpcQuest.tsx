import { type NpcQuest } from "@/types/api/questnpc"
import styles from "./Npcs.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import detailPageStyles from "@/components/ui/DetailPage/DetailPage.module.css"
import questStyles from "@/pages/quests/Quests.module.css"
import SmallSparkle from "@/assets/svgs/small-sparkle.svg?react"
import { SquarePen } from "lucide-react"
import { useNavigate } from "react-router-dom"
import QuestNpcEditor, { QuestNpcEditorAction } from "./QuestNpcEditor"
import { useState } from "react"
import TrashIcon from "@/components/ui/DetailPage/TrashIcon"
import { deleteQuestNpc } from "@/api/questnpc"

interface NpcQuestProps {
  npcQuest: NpcQuest
  fetchQuests: () => void
}

export default function NpcQuest ({ npcQuest, fetchQuests }: NpcQuestProps) {
  const navigate = useNavigate()
  const [ showNpcQuestEditor, setShowNpcQuestEditor ] = useState<boolean>(false)

  const onDelete = async () => {
    try {
      await deleteQuestNpc(npcQuest.id)
      fetchQuests()
    } catch (error) {
      console.error("Failed to delete NPC quest: ", error)
    }
  }

  return (
    <>
      {!showNpcQuestEditor && <div 
        key={npcQuest.id} 
        className={layoutStyles.mini_card}
        onClick={() => navigate(`/quests/${npcQuest.questId}`)}
      >
        <div className={`${styles.quest_info} ${styles.spaced}`}>
          <div className={styles.quest_info}>
            <SmallSparkle 
              style={{ 
                fill: "var(--qb-blue-slime)",
                height: "15px",
                width: "15px"
              }}
            />
            <p className={styles.quest_title}>
              {npcQuest.quest.title}
            </p>
            {npcQuest.role && 
              <p className={`${styles.npc_property} ${styles.npc_status} ${styles.ALIVE}`}>
                {npcQuest.role}
              </p>
            }
          </div>
          <div className={styles.quest_info}>
            <p className={`${styles.npc_property} ${questStyles.quest_status} ${questStyles[npcQuest.quest.status]}`}>{npcQuest.quest.status}</p>
            <SquarePen
              className={detailPageStyles.green_icon}
              onClick={(e) => {
                e.stopPropagation()
                setShowNpcQuestEditor(true)
              }}
            />
            <TrashIcon onDelete={onDelete}/>
          </div>
        </div>
        {npcQuest.notes && 
          <p className={styles.quest_notes}>{npcQuest.notes}</p>
        }
      </div>}
      {showNpcQuestEditor && <QuestNpcEditor
        npcId={npcQuest.npcId}
        npcQuest={npcQuest}
        action={QuestNpcEditorAction.UPDATE}
        onAction={fetchQuests}
        onClose={() => setShowNpcQuestEditor(false)}
      />}
    </>
  )
}