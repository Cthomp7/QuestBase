import { CreateQuestRequest, Quest } from "@/types/api/quest"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "./Quests.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import DetailPage from "@/components/ui/DetailPage/DetailPage"
import PageDetailStyles from "@/components/ui/DetailPage/DetailPage.module.css"
import TextEditor from "@/components/ui/TextEditor/TextEditor"
import QuestEditor from "./QuestEditor/QuestEditor"
import { useCampaign } from "@/context/campaign/useCampaign"
import Loader from "@/components/ui/Loader/Loader"
import DetailNotFound from "@/components/states/DetailNotFound/DetailNotFound"

export default function QuestDetails () {
  const { questId } = useParams()
  const navigate = useNavigate()
  const { activeCampaign } = useCampaign()
  const [ quest, setQuest ] = useState<Quest | null>(null)
  const [ notes, setNotes ] = useState<string>("")
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ editting, setEditting ] = useState<boolean>(false)

  const fetchQuest = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/quests/${questId}`,
        { method: "GET" }
      )
      if (response.ok) {
        const quest = await response.json()
        setQuest(quest)
        setNotes(quest?.notes)
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error("Failed to fetch NPC: ", error)
    } finally {
      setLoading(false)
    }
  }, [questId])

  useEffect(() => {
    fetchQuest()
  },[fetchQuest])

  const saveNotes = useCallback(async (notes: string) => {
    try {
      const response = await fetch(`/api/quests/${questId}/save-notes`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      })
      if (response.ok) {
        const quest = await response.json()
        setQuest(quest)
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error("Failed to save NPC notes: ", error)
    }
  }, [questId])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!notes) return
      saveNotes(notes)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [notes, saveNotes])

  const updateQuest = async (
    id: number, 
    questRequest: CreateQuestRequest
  ) => {
    try {
      const response = await fetch(`/api/quests/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questRequest)
      })
      if (response.ok) {
        const savedQuest = await response.json()
        setQuest(savedQuest)
        setEditting(false)
      } else console.error(response)
    } catch (error) {
      console.error("Failed to update quest: ", error)
    }
  }

  const deleteQuest = async () => {
    try {
      const response = await fetch(`/api/quests/${questId}`, { method: "DELETE" })
      if (response.ok) {
        navigate("/quests")
      } else console.error(response)
    } catch (error) {
      console.error("Failed to delete quest: ", error)
    }
  }

  return (
    <div className={layoutStyles.page_container}>
      {quest ? (
        <DetailPage
          title={quest.title}
          editting={editting}
          onEdit={(active) => setEditting(active)}
          onDelete={deleteQuest}
          children={
            <div className={PageDetailStyles.information}>
              {editting ? (
                <QuestEditor
                  action="Edit"
                  activeCampaignId={activeCampaign?.id}
                  quest={quest}
                  updateQuest={updateQuest}
                  setEditorVisible={(visible) => setEditting(visible)}
                />
              ) : (
                <>
                  <div className={PageDetailStyles.traits}>
                    <p className={`${styles.quest_card_property} ${styles.quest_status} ${styles[quest.status]}`}>
                      {quest.status.replace(/_/g, " ")}
                    </p>
                    <p className={`${styles.quest_card_property} ${styles.quest_difficulty} ${styles[quest.difficulty]}`}>
                      {quest.difficulty}
                    </p>
                    <p className={`${styles.quest_card_property} ${styles.quest_xp}`}>
                      {quest.rewardXp}{" "}XP
                    </p>
                  </div>
                  {quest.description && 
                    <div className={PageDetailStyles.text}>
                      <p className={PageDetailStyles.text_label}>Description:</p>
                      <p>{quest.description}</p>
                    </div>
                  }
                  <div>
                    <p className={PageDetailStyles.text_label}>Notes:</p>
                    <TextEditor
                      value={notes}
                      onChange={setNotes}
                    />
                  </div>
                </>
              )}
            </div>
          }
        />
      ) : loading ? (
        <Loader />
      ) : (
        <DetailNotFound 
          title={<><span>Quest</span> Not Found</>}
          message="This quest seems to have vanished from the realm."
          buttonText="Back to quests"
          onClick={() => navigate("/quests")}
        />
      )}
    </div>
  )
}