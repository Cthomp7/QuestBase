import Editor from "@/components/Editor/Editor"
import Loader from "@/components/ui/Loader/Loader"
import { useCallback, useEffect, useState } from "react"
import editorStyles from "@/components/Editor/Editor.module.css"
import Dropdown, { DropdownOption } from "@/components/Dropdown/Dropdown"
import { useCampaign } from "@/context/campaign/useCampaign"
import { Quest } from "@/types/api/quest"
import { fetchQuests } from "@/api/quests"
import { createQuestNpc, updateQuestNpc } from "@/api/questnpc"
import { CreateQuestNpcRequest, NpcQuest, QuestNpc, UpdateQuestNpcRequest } from "@/types/api/questnpc"
import { Npc } from "@/types/api/npc"
import { fetchNpcs } from "@/api/npcs"

export enum QuestNpcEditorAction {
  "CREATE",
  "UPDATE"
}

interface QuestNpcParent {
  id: string,
  type: string
}

interface QuestNpcEditorProps {
  parent: QuestNpcParent
  questNpc?: NpcQuest | QuestNpc
  action: QuestNpcEditorAction
  onAction: () => void
  onClose: () => void
}

export default function QuestNpcEditor ({
  parent,
  questNpc,
  action,
  onAction,
  onClose
}: QuestNpcEditorProps) {
  const { activeCampaign } = useCampaign()
  const [ questId, setQuestId ] = useState<string>("")
  const [ npcId, setNpcId ] = useState<string>("")
  const [ role, setRole ] = useState<string>("")
  const [ notes, setNotes ] = useState<string>("")
  const [ dropdownOptions, setDropdownOptions ] = useState<DropdownOption[]>([])
  const [ loading, setLoading ] = useState<boolean>(false)

  // generate dynamic UI elements
  const header =
  action === QuestNpcEditorAction.CREATE
    ? <>Add <span>NPC</span> to a <span>quest</span></>
    : questNpc && "npc" in questNpc
      ? <>Editing NPC: <span>{questNpc.npc.name}</span></>
      : questNpc && "quest" in questNpc
        ? <>Editing Quest: <span>{questNpc.quest.title}</span></>
        : null

  const button = action === QuestNpcEditorAction.CREATE ? "Create" : "Update"

  useEffect(() => {
    if (parent.type === "quest") setQuestId(parent.id)
    else if (parent.type === "npc") setNpcId(parent.id)
  },[parent])

  // Set editor values if quest NPC is passed down
  useEffect(() => {
    if (questNpc) {
      setQuestId(String(questNpc.questId))
      setNpcId(String(questNpc.npcId))
      setRole(questNpc.role ?? "")
      setNotes(questNpc.notes ?? "")
    }
  }, [questNpc])

  const loadNpcs = useCallback(async () => {
    if (!activeCampaign?.id) return
    try {
      const npcs = await fetchNpcs(activeCampaign.id)
      generateNpcDropdownOptions(npcs)
    } catch (error) {
      console.error("Failed to load NPCs:", error)
    }
  }, [activeCampaign?.id])

  const loadQuests = useCallback(async () => {
    if (!activeCampaign?.id) return
    try {
      const quests = await fetchQuests(activeCampaign.id)
      generateQuestDropdownOptions(quests)
    } catch (error) {
      console.error("Failed to load quests:", error)
    }
  }, [activeCampaign?.id])

  // Fetch and generate dropdown options based on parent type
  useEffect(() => {
    if (action === QuestNpcEditorAction.CREATE) {
      if (parent.type === 'quest') loadNpcs()
      else if (parent.type === 'npc') loadQuests()
    }
  },[action, parent, loadNpcs, loadQuests])

  const generateNpcDropdownOptions = (npcs: Npc[]) => {
    const options: DropdownOption[] = 
      npcs.map((npc) => 
        ({ label: npc.name, value: String(npc.id) })
      )
    setDropdownOptions(options)
  }

  const generateQuestDropdownOptions = (quests: Quest[]) => {
    const options: DropdownOption[] = 
      quests.map((quest) => 
        ({ label: quest.title, value: String(quest.id) })
      )
    setDropdownOptions(options)
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
      questId: Number(questId), 
      npcId: Number(npcId), 
      role, 
      notes 
    }
    await createQuestNpc(request)
  }

  const update = async () => {
    if (!questNpc) return
    const request: UpdateQuestNpcRequest = { role, notes }
    await updateQuestNpc(questNpc.id, request)
  }

  const setId = (id: string) => {
    if (parent.type === 'quest') setNpcId(id)
    else if (parent.type === 'npc') setQuestId(id)
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
                options={dropdownOptions}
                value={parent.type === 'quest' ? npcId : questId}
                onChange={(id) => setId(id)}
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
          <p>Notes:</p>
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