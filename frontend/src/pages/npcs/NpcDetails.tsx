import { CreateNpcRequest, Npc } from "@/types/api/npc"
import { useCallback, useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import styles from "./Npcs.module.css"
import layoutStyles from "@/layouts/AuthLayout/AuthLayout.module.css"
import { Briefcase, ChartNoAxesColumnIncreasing, IdCard } from "lucide-react"
import TextEditor from "@/components/ui/TextEditor/TextEditor"
import NpcEditor from "./NpcEditor"
import DetailPage from "@/components/ui/DetailPage/DetailPage"
import PageDetailStyles from "@/components/ui/DetailPage/DetailPage.module.css"
import Loader from "@/components/ui/Loader/Loader"
import DetailNotFound from "@/components/states/DetailNotFound/DetailNotFound"

export default function NpcsDetails () {
  const { npcId } = useParams()
  const navigate = useNavigate()
  const [ npc, setNpc ] = useState<Npc | null>(null)
  const [ notes, setNotes ] = useState<string>("")
  const [ loading, setLoading ] = useState<boolean>(true)
  const [ submitting, setSubmitting ] = useState<boolean>(true)
  const [ editting, setEditting ] = useState<boolean>(false)

  const toggleEdit = () => {
    setEditting(!editting)
  }

  const fetchNpc = useCallback(async () => {
    try {
      const response = await fetch(
        `/api/npcs/${npcId}`,
        { method: "GET" }
      )
      if (response.ok) {
        const npc = await response.json()
        setNpc(npc)
        setNotes(npc?.notes)
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error("Failed to fetch NPC: ", error)
    } finally {
      setLoading(false)
    }
  },[npcId])

  useEffect(() => {
    fetchNpc()
  },[fetchNpc])

  const updateNpc = async (npcRequest: CreateNpcRequest) => {
    try {
      setSubmitting(true)
      const response = await fetch(`/api/npcs/${npcId}`, { 
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(npcRequest)
      })
      if (response.ok) {
        const savedNpc = await response.json()
        setNpc(savedNpc)
        toggleEdit()
      } else console.error(response)
    } catch (error) {
      console.error("Failed to create NPC: ", error)
    } finally {
      setSubmitting(false)
    }
  }

  const deleteNpc = async () => {
    try {
      const response = await fetch(
        `/api/npcs/${npcId}`, 
        { method: "DELETE" }
      )
      if (response.ok) {
        navigate("/npcs")
      } else console.error(response)
    } catch (error) {
      console.error("Failed to delete NPC: ", error)
    }
  }

  const saveNotes = useCallback(async (notes: string) => {
    try {
      const response = await fetch(`/api/npcs/${npcId}/save-notes`, { 
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes })
      })
      if (response.ok) {
        const npc = await response.json()
        setNpc(npc)
      } else {
        console.error(response)
      }
    } catch (error) {
      console.error("Failed to save NPC notes: ", error)
    }
  }, [npcId])

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!notes) return
      saveNotes(notes)
    }, 1500)

    return () => clearTimeout(timeout)
  }, [notes, saveNotes])

  return (
    <div className={layoutStyles.page_container}>
      {npc ? (
          <DetailPage
            title={npc.name}
            editting={editting}
            onEdit={(active) => setEditting(active)}
            onDelete={deleteNpc}
            children={
              <div className={PageDetailStyles.information}>
                {editting ? (
                  <>
                    <NpcEditor 
                      action="Update"
                      npc={npc}
                      loading={submitting}
                      onTrigger={(npc) => updateNpc(npc)}
                      onClose={toggleEdit}
                    />
                  </>
                ) : (
                  <>
                    <div className={PageDetailStyles.traits}>
                      {npc.status && <p className={`${styles.npc_property} ${styles.npc_status} ${styles[npc.status]}`}>{npc.status}</p>}
                      {npc.role && <p className={`${styles.npc_property} ${styles.npc_role} ${styles[npc.role]}`}>{npc.role.replace(/_/g, " ")}</p>}
                      {npc.level > 0 && <div>
                        <ChartNoAxesColumnIncreasing/>
                        <p>Level {npc.level}</p>
                      </div>}
                      {npc.race && <div>
                        <IdCard />
                        <p>{npc.race}</p>
                      </div>}
                      {npc.occupation && <div>
                        <Briefcase />
                        <p>{npc.occupation}</p>
                      </div>}
                      {/* add class later */}
                    </div>
                    {npc.description && 
                      <div className={PageDetailStyles.text}>
                        <p className={PageDetailStyles.text_label}>Description:</p>
                        <p>{npc.description}</p>
                      </div>
                    }
                    <div className={styles.npc_info_2}>
                      {npc.personality && <div className={PageDetailStyles.text}>
                        <p className={PageDetailStyles.text_label}>Personality:</p>
                        <p>{npc.personality}</p>
                      </div>}
                      {npc.appearance && <div className={PageDetailStyles.text}>
                        <p className={PageDetailStyles.text_label}>Appearance:</p>
                        <p>{npc.appearance}</p>
                      </div>}
                    </div>
                  </>
                )}
                <div>
                  <p className={PageDetailStyles.text_label}>Notes:</p>
                  <TextEditor
                    value={notes}
                    onChange={setNotes}
                  />
                </div>
              </div>
            }
          />
      ) : loading ? (
        <Loader />
      ) : (
        <DetailNotFound 
          title={<><span>NPC</span> Not Found</>}
          message="This NPC seems to have vanished from the realm."
          buttonText="Back to NPCs"
          onClick={() => navigate("/npcs")}
        />
      )}
    </div>
  )
}