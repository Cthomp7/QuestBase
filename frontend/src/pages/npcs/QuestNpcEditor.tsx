import Editor from "@/components/Editor/Editor"
import Loader from "@/components/ui/Loader/Loader"
import { useCallback, useEffect, useState } from "react"
import editorStyles from "@/components/Editor/Editor.module.css"
import Dropdown, { DropdownOption } from "@/components/Dropdown/Dropdown"
import { useCampaign } from "@/context/campaign/useCampaign"
import { Quest } from "@/types/api/quest"
import { fetchQuests } from "@/api/quests"
import { createQuestNpc, updateQuestNpc } from "@/api/questnpc"
import { CreateQuestNpcRequest, NpcQuest, UpdateQuestNpcRequest } from "@/types/api/questnpc"

export enum QuestNpcEditorAction {
  "CREATE",
  "UPDATE"
}

interface QuestNpcEditorProps {
  npcId: number,
  npcQuest?: NpcQuest
  action: QuestNpcEditorAction
  onAction: () => void
  onClose: () => void
}

export default function QuestNpcEditor ({ 
  npcId,
  npcQuest,
  action,
  onAction,
  onClose
}: QuestNpcEditorProps) {
  const { activeCampaign } = useCampaign()
  const [ questId, setQuestId ] = useState<string>("")
  const [ role, setRole ] = useState<string>("")
  const [ notes, setNotes ] = useState<string>("")
  const [ questDropdownOptions, setQuestDropdownOptions ] = useState<DropdownOption[]>([])
  const [ loading, setLoading ] = useState<boolean>(false)

  const header = action === QuestNpcEditorAction.CREATE
    ? <>Add <span>NPC</span> to a <span>quest</span></>
    : <>Editting: <span>{npcQuest?.quest.title}</span> Quest</>

  const button = action === QuestNpcEditorAction.CREATE ? "Create" : "Update"

  useEffect(() => {
    if (npcQuest) {
      setQuestId(String(npcQuest.questId))
      setRole(npcQuest.role ?? "")
      setNotes(npcQuest.notes ?? "")
    }
  }, [npcQuest])

  const loadQuests = useCallback(async () => {
    if (!activeCampaign?.id) return
    try {
      const quests = await fetchQuests(activeCampaign.id)
      generateDropdownOptions(quests)
    } catch (error) {
      console.error("Failed to load quests:", error)
    }
  }, [activeCampaign?.id])

  useEffect(() => {
    loadQuests()
  },[loadQuests])

  const generateDropdownOptions = (quests: Quest[]) => {
    const options: DropdownOption[] = 
      quests.map((quest) => 
        ({ label: quest.title, value: String(quest.id) })
      )
    setQuestDropdownOptions(options)
  }

  const handleClick = async () => {
    try {
      setLoading(true)
      if (action === QuestNpcEditorAction.CREATE) await create()
      else if (action === QuestNpcEditorAction.UPDATE) await update()
      onAction()
      onClose()
    } catch (error) {
      console.error("Failed to save quest NPC:", error)
    } finally {
      setLoading(false)
    }
  }

  const create = async () => {
    const request: CreateQuestNpcRequest = { 
      questId: Number(questId), npcId, role, notes 
    }
    await createQuestNpc(request)
  }

  const update = async () => {
    const request: UpdateQuestNpcRequest = { role, notes }
    await updateQuestNpc(npcId, request)
  }

  return (
    <Editor
      header={header}
      onClose={onClose}
      children={
        <>
          {action === QuestNpcEditorAction.CREATE && 
            <div className={editorStyles.editor_property}>
              <p>Select a quest:</p>
              <Dropdown
                options={questDropdownOptions}
                value={questId}
                onChange={(id) => setQuestId(id)}
                className={`${editorStyles.dropdown_property} ${editorStyles.larger}`}
              ></Dropdown>
            </div>
          }
          <div className={editorStyles.editor_property}>
            <p>Role:</p>
            <input 
              type="text" 
              name="role" 
              placeholder="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </div>
          <p>Description:</p>
          <textarea 
            name="notes" 
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
          {!loading ? (
            <button
              className={editorStyles.button}
              onClick={handleClick}
            >{button}</button>
          ) : (
            <Loader/>
          )}
        </>
      }
    />
  )
}