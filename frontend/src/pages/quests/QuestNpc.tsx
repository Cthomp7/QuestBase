import { type QuestNpc } from "@/types/api/questnpc"
import styles from "./Quests.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import detailPageStyles from "@/components/ui/DetailPage/DetailPage.module.css"
import npcStyles from "@/pages/npcs/Npcs.module.css"
import SmallSparkle from "@/assets/svgs/small-sparkle.svg?react"
import { SquarePen } from "lucide-react"
import { useNavigate } from "react-router-dom"
// import QuestNpcEditor, { QuestNpcEditorAction } from "./QuestNpcEditor"
import { useState } from "react"
import TrashIcon from "@/components/ui/DetailPage/TrashIcon"
import { deleteQuestNpc } from "@/api/questnpc"
import QuestNpcEditor, { QuestNpcEditorAction } from "../npcs/QuestNpcEditor"

interface QuestNpcProps {
  questNpc: QuestNpc
  fetchNpcs: () => void
}

export default function QuestNpc ({ questNpc, fetchNpcs }: QuestNpcProps) {
  const navigate = useNavigate()
  const [ showNpcQuestEditor, setShowNpcQuestEditor ] = useState<boolean>(false)

  const onDelete = async () => {
    try {
      await deleteQuestNpc(questNpc.id)
      fetchNpcs()
    } catch (error) {
      console.error("Failed to delete NPC quest: ", error)
    }
  }

  return (
    <>
      {!showNpcQuestEditor && <div 
        key={questNpc.id} 
        className={layoutStyles.mini_card}
        onClick={() => navigate(`/npcs/${questNpc.npcId}`)}
      >
        <div className={`${detailPageStyles.relationship_info} ${detailPageStyles.spaced}`}>
          <div className={detailPageStyles.relationship_info}>
            <SmallSparkle 
              style={{ 
                fill: "var(--qb-blue-slime)",
                height: "15px",
                width: "15px"
              }}
            />
            <p className={detailPageStyles.relationship_title}>
              {questNpc.npc.name}
            </p>
            {questNpc.role && 
              <p className={styles.blue_bubble}>
                {questNpc.role}
              </p>
            }
          </div>
          <div className={detailPageStyles.relationship_info}>
            {questNpc.npc.status &&
              <p className={`${npcStyles.npc_property} ${npcStyles.npc_status} ${npcStyles[questNpc.npc.status]}`}>
                {questNpc.npc.status}
              </p>
            }
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
        {questNpc.notes && 
          <p className={detailPageStyles.relationship_notes}>{questNpc.notes}</p>
        }
      </div>}
      {showNpcQuestEditor && <QuestNpcEditor
        parent={{ id: String(questNpc.questId), type: "quest" }}
        questNpc={questNpc}
        action={QuestNpcEditorAction.UPDATE}
        onAction={fetchNpcs}
        onClose={() => setShowNpcQuestEditor(false)}
      />}
    </>
  )
}