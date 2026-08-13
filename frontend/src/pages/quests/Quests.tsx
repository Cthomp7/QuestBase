import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import styles from "./Quests.module.css"
import EditIcon from "@/assets/edit.svg?react"
import TrashIcon from "@/assets/trash.svg?react"
import { useCallback, useEffect, useRef, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { CreateQuestRequest, Quest } from "@/types/api/quest"
import { useCampaign } from "@/context/campaign/useCampaign"
import QuestEditor from "./QuestEditor/QuestEditor"
import CampaignEmptyState from "@/components/states/CampaignEmptyState/CampaignEmptyState"
import PageHeader from "@/components/ui/PageHeader/PageHeader"
import CreateButton from "@/components/ui/CreateButton/CreateButton"
import { useNavigate } from "react-router-dom"

const Quests = () => {
  const { user } = useAuth()
  const { activeCampaign } = useCampaign()
  const navigate = useNavigate()
  const [quests, setQuests] = useState<Quest[]>([])
  const noResultsRef = useRef<HTMLDivElement | null>(null)
  const createDivRef = useRef<HTMLDivElement | null>(null)
  const [creating, setCreating] = useState<boolean>(false)
  const [editting, setEditting] = useState<{ quest: Quest | null, index: number}>({ quest: null, index: -1 })
  const [confirmDeletion, setConfirmDeletion] = useState<number>(-1)

  const fetchQuests = useCallback(async () => {
    if (!activeCampaign?.id) return;

    try {
      const response = await fetch(
        `/api/campaigns/${activeCampaign.id}/quests`,
        { method: "GET" }
      );

      if (response.ok) {
        const quests = await response.json();
        setQuests(quests);
      } else {
        console.error(response);
      }
    } catch (error) {
      console.error("Failed to fetch quests: ", error);
    }
  }, [activeCampaign?.id]);

    useEffect(() => {
    if (user && activeCampaign?.id) {
      fetchQuests()
    }
  }, [user, activeCampaign, fetchQuests])

  const createQuest = async (questRequest: CreateQuestRequest) => {
    try {
      validate(questRequest)
      const response = await fetch('/api/quests', { 
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questRequest)
      })
      if (response.ok) {
        const newQuest = await response.json()
        setQuests([...quests, newQuest])
        setEditorVisible('create', false)
      } else console.error(response)
    } catch (error) {
      console.error("Failed to create quest: ", error)
    }
  }

  const editQuest = async (id: number, questRequest: CreateQuestRequest) => {
    if (id < 0) {
      console.error("No quest id provided.")
      return
    }
    try {
      validate(questRequest)
      const response = await fetch(`/api/quests/${id}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(questRequest)
      })
      if (response.ok) {
        fetchQuests()
        setEditorVisible('edit', false)
      } else console.error(response)
    } catch (error) {
      console.error("Failed to update quest: ", error)
    }
  }

  const deleteQuest = async (id: number) => {
    try {
      const response = await fetch(`/api/quests/${id}`, { method: "DELETE" })
      if (response.ok) {
        fetchQuests()
        setConfirmDeletion(-1)
      } else console.error(response)
    } catch (error) {
      console.error("Failed to update quest: ", error)
    }
  }

  const validate = (quest: CreateQuestRequest) => {
    if (!quest.title) 
      throw new Error("Please enter a valid quest title.")
    else if (quest.rewardXp < 0 || quest.rewardXp > 1000000) 
      throw new Error("XP reward must be between 0 and 1,000,000")
    else if (!quest.campaignId) 
      throw new Error("No active campaign was found.")
  }

  const setEditorVisible = (type: string, visible: boolean) => {
    if (type === 'create') {
      setCreating(visible ? true : false)
    }

    if (noResultsRef.current && quests.length <= 0) 
      noResultsRef.current.style.display = visible ? "none" : "flex"
    if (createDivRef.current)
      createDivRef.current.style.display = visible ? "none" : "flex"

    if (!visible && type === 'edit') setEditting({ quest: null, index: -1})
  }

  return (
    <div className={layoutStyles.page_container}>
      <PageHeader title="Quests" activeCampaign={activeCampaign}/>
      {creating && <QuestEditor
        action="Create"
        activeCampaignId={activeCampaign?.id}
        updateQuest={(_id, req) => createQuest(req)}
        setEditorVisible={(visible) => setEditorVisible('create', visible)}
      />}
      {/* QUESTS */}
      {!activeCampaign ? (
          <CampaignEmptyState type={"quests"} />
        ) : quests.length > 0 ? (
          <>
            {!creating && <CreateButton
              text="Create a new Quest"
              onClick={() => setEditorVisible('create', true)}
            />}
            <div className={styles.quests}>
                {quests.map((quest, i) => (
                  <div 
                    key={quest.id} 
                    className={layoutStyles.card}
                    style={{ order: i, display: editting.index === i ? "none" : "flex" }}
                    onClick={() => navigate(`/quests/${quest.id}`)}
                  >
                    <div className={styles.quest_card_header}>
                      <p className={layoutStyles.card_title}>{quest.title}</p>
                      <div className={styles.quest_card_properties}>
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
                    </div>
                    <p>{quest.description}</p>
                    <div className={styles.quest_actions}>
                      {confirmDeletion === quest.id
                        ? <div className={styles.confirm_deletion}>
                            <p>Are you sure you want to <span>DELETE</span> this quest?</p>
                            <button onClick={(e) => {
                              e.stopPropagation()
                              deleteQuest(quest.id)
                            }}>Yes</button>
                            <button onClick={(e) => {
                              e.stopPropagation()
                              setConfirmDeletion(-1)
                            }}>No</button>
                          </div>
                        : <>
                            <EditIcon
                              className={layoutStyles.edit_icon}
                              onClick={(e) => {
                                e.stopPropagation()
                                setEditting({ quest, index: i })
                              }} 
                            />
                            <TrashIcon 
                              className={layoutStyles.trash_icon}
                              onClick={(e) => {
                                e.preventDefault()
                                setConfirmDeletion(quest.id)
                              }}
                            />
                          </>}
                    </div>
                  </div>
                ))}
                {editting.index >= 0 && <QuestEditor
                  action="Edit"
                  activeCampaignId={activeCampaign?.id ?? 0}
                  quest={editting.quest}
                  updateQuest={(id, req) => editQuest(id, req)}
                  setEditorVisible={(visible) => setEditorVisible('edit', visible)}
                />}
            </div>
          </>
          ) : (
            <div 
              ref={noResultsRef}
              className={layoutStyles.no_results}
            >
              <div>
                <h2>No quests Found</h2>
                <p>Create a new quest for your campaign below!</p>
              </div>
              <CreateButton
                text="Create a new quest"
                onClick={() => setEditorVisible('create', true)}
              />
            </div>
          )
        }
    </div>
  )
}

export default Quests