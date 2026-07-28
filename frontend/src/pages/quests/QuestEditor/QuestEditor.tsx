import { forwardRef, useImperativeHandle, useRef, useState } from "react"
import styles from "./QuestEditor.module.css"
import Dropdown from "@/components/Dropdown/Dropdown"
import CloseIcon from "@/assets/x.svg?react"
import { CreateQuestRequest, Quest } from "@/types/api/quest"

export type QuestEditorHandle = HTMLDivElement & {
  editQuest: (quest: Quest) => void;
};

interface QuestEditorProps {
  style?: React.CSSProperties
  activeCampaignId: number | null
  updateQuest: (id: number, quest: CreateQuestRequest) => void
  setEditorVisible: (visible: boolean) => void
}

const QuestEditor = forwardRef<QuestEditorHandle, QuestEditorProps>(({ 
  style,
  activeCampaignId,
  updateQuest,
  setEditorVisible
}, ref) => {
  const editorRef = useRef<HTMLDivElement | null>(null)
  const [id, setId] = useState<number>(-1)
  const [title, setTitle] = useState<string>("")
  const [status, setStatus] = useState<string>("NOT_STARTED")
  const [difficulty, setDifficulty] = useState<string>("")
  const [xp, setXp] = useState<string>("")
  const [description, setDescription] = useState<string>("")

  // Dynamic UI 
  const [header, setHeader] = useState<string>("Create a Quest")
  const [buttonText, setButtontext] = useState<string>("Create")

  // TODO: fetch status and difficulty options from backend
  const statuses = [
    { label: "Not Started", value: "NOT_STARTED" },
    { label: "Active", value: "ACTIVE" },
    { label: "Completed", value: "COMPLETED" },
    { label: "Failed", value: "FAILED" }
  ]

  const difficulties = [
    { label: "Easy", value: "EASY" },
    { label: "Medium", value: "MEDIUM" },
    { label: "Hard", value: "HARD" },
    { label: "Deadly", value: "DEADLY" }
  ]

  useImperativeHandle(ref, () => {
    const element = editorRef.current;
    if (!element) {
      throw new Error("QuestEditor element is not mounted");
    }

    return Object.assign(element, {
      editQuest(quest: Quest) {
        handleEditQuest(quest)
      }
    })
  })

  const handleEditQuest = (quest: Quest) => {
    setHeader("Edit Quest")
    setButtontext("Update")
    setId(quest.id)
    setTitle(quest.title)
    setXp(quest.rewardXp)
    setStatus(quest.status)
    setDifficulty(quest.difficulty)
    setDescription(quest.description)
  }

  const handleCreateQuest = () => {
    const rewardXp = Number(xp);
    const quest: CreateQuestRequest = {
      title,
      description,
      status,
      difficulty,
      rewardXp,
      campaignId: Number(activeCampaignId)
    }
    updateQuest(id, quest)
  }

  // const editQuest = () => {

  // }

  return (
    <div 
      ref={editorRef}
      className={styles.quest_editor}
      style={style}
    >
      <div className={styles.editor_content}>
        <div className={styles.editor_title}>
          <h1>{header}</h1>
          <CloseIcon
            className={styles.closeIcon} 
            onClick={() => setEditorVisible(false)}
          />
        </div>
        <div className={styles.editor_property}>
        <p>Title:</p>
          <input 
            type="text" 
            name="name" 
            placeholder="Name"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className={styles.editor_container}>
          <div className={styles.editor_property}>
            <p>Status:</p>
            <Dropdown
              options={statuses}
              value={status}
              onChange={(status) => setStatus(status)}
              className={styles.quest_property}
            ></Dropdown>
          </div>
          <div className={styles.editor_property}>
            <p>Difficulty:</p>
            <Dropdown
              options={difficulties}
              value={difficulty}
              onChange={(diff) => setDifficulty(diff)}
              className={styles.quest_property}
            >
            </Dropdown>
          </div>
          <div className={styles.editor_property}>
            <p>Xp Reward:</p>
            <input 
              type="number" 
              name=""
              min={0}
              max={1000000}
              className={styles.quest_property}
              value={xp}
              onChange={(e) => setXp(e.target.value)}
            />
          </div>
        </div>
        <p>Description:</p>
        <textarea 
          className={styles.quest_description}
          name="description" 
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className={styles.edit_button} onClick={handleCreateQuest}>{buttonText}</button>
      </div>
    </div>
  )
})

export default QuestEditor